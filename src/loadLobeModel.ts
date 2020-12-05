import { LobeModel } from './lobeModel';
import loadTf from 'tfjs-node-lambda';

let model: LobeModel;
export async function loadLobeModel(modelDirectory: string) {
  const tf: typeof import('@tensorflow/tfjs') = await loadTf();
  if (!model) {
    model = new LobeModel(tf, modelDirectory);
    await model.load();
  }
  return model;
}
