import type tf from "@tensorflow/tfjs";
import fs from "fs-extra";
import path from "path";
import axios from "axios";
import isUrl from "is-url";

interface SignatureData {
  doc_id: string;
  doc_name: string;
  doc_version: string;
  format: string;
  version: number;
  inputs: {
    Image: {
      dtype: string;
      shape: string;
      name: string;
    };
  };
  outputs: {
    Confidences: {
      dtype: string;
      shape: (null | number)[];
      name: string;
    };
  };
  tags: string[];
  classes: {
    Label: string[];
  };
  filename: string;
}

export class LobeModel {
  signature: any;
  // @ts-ignore: strictPropertyInitialization
  modelPath: string;
  // @ts-ignore: strictPropertyInitialization
  height: number;
  // @ts-ignore: strictPropertyInitialization
  width: number;
  // @ts-ignore: strictPropertyInitialization
  outputName: string;
  outputKey = "Confidences";
  // @ts-ignore: strictPropertyInitialization
  classes: string[];
  model?: tf.GraphModel;

  constructor(
    private readonly tf: typeof import("@tensorflow/tfjs"),
    private readonly modelDirectory: string
  ) {}

  async load() {
    if (isUrl(this.modelDirectory)) {
      const response = await axios.get<SignatureData>(
        `${this.modelDirectory}/signature.json`
      );
      this.signature = response.data;
      this.modelPath = `${this.modelDirectory}/${this.signature.filename}`;
      [this.width, this.height] = this.signature.inputs.Image.shape.slice(1, 3);
      this.outputName = this.signature.outputs[this.outputKey].name;
      this.classes = this.signature.classes.Label;
    } else {
      const signatureData = await fs.readFile(
        path.join(this.modelDirectory, "signature.json"),
        "utf8"
      );
      this.signature = JSON.parse(signatureData);
      this.modelPath = `file://${path.join(
        this.modelDirectory,
        this.signature.filename
      )}`;
      [this.width, this.height] = this.signature.inputs.Image.shape.slice(1, 3);
      this.outputName = this.signature.outputs[this.outputKey].name;
      this.classes = this.signature.classes.Label;
    }

    this.model = await this.tf.loadGraphModel(this.modelPath);
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }

  predict(imageBuffer: Buffer) {
    /*
      Given an input image decoded by tensorflow as a tensor,
      preprocess the image into pixel values of [0,1], center crop to a square
      and resize to the image input size, then run the prediction!
       */
    if (!!this.model) {
      // https://stackoverflow.com/a/59934467
      this.tf.engine().startScope()
      // @ts-ignore: Property 'node' does not exist on type
      const image = this.tf.node.decodeImage(imageBuffer, 3);
      const [imgHeight, imgWidth] = image.shape.slice(0, 2);
      // convert image to 0-1
      const normalizedImage = this.tf.div(image, this.tf.scalar(255));
      // make into a batch of 1 so it is shaped [1, height, width, 3]
      const reshapedImage: tf.Tensor4D = normalizedImage.reshape([
        1,
        ...normalizedImage.shape,
      ]);
      // center crop and resize
      let top = 0;
      let left = 0;
      let bottom = 1;
      let right = 1;
      // eslint-disable-next-line eqeqeq
      if (imgHeight != imgWidth) {
        // the crops are normalized 0-1 percentage of the image dimension
        const size = Math.min(imgHeight, imgWidth);
        left = (imgWidth - size) / 2 / imgWidth;
        top = (imgHeight - size) / 2 / imgHeight;
        right = (imgWidth + size) / 2 / imgWidth;
        bottom = (imgHeight + size) / 2 / imgHeight;
      }
      const croppedImage = this.tf.image.cropAndResize(
        reshapedImage,
        [[top, left, bottom, right]],
        [0],
        [this.height, this.width]
      );
      const results = this.model.execute(
        { [this.signature.inputs.Image.name]: croppedImage },
        this.outputName
      ) as tf.Tensor;
      const resultsArray = results.dataSync();

      const output = {
        [this.outputKey]: this.classes.reduce((acc, class_, idx) => {
          return { [class_]: resultsArray[idx], ...acc };
        }, {}),
      };

      this.tf.engine().endScope();

      return output;
    } else {
      throw new Error("Model not loaded, please await this.load() first.")
    }
  }
}
