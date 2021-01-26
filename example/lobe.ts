// Mirror updates to README.md

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
// import { PrepareLobe, isLambda, LobeModel } from "tfjs-node-lambda-helpers";
import { PrepareLobe, isLambda, LobeModel } from "../src/";

const baseUrl = isLambda()
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:3000`;
const prepareLobe = PrepareLobe(`${baseUrl}/static/model`);

let model: LobeModel;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const lobe = await prepareLobe.next();
  if (!lobe.done) {
    return res.status(lobe.value.statusCode).json(lobe.value);
  } else {
    if (!model) {
      model = lobe.value;
    }
  }
  const imageUrl = req.body.imageUrl;

  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  const results = model.predict(response.data);

  return res.status(200).json({ results: results.Confidences });
};
