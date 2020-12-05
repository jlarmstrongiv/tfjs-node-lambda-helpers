// Mirror updates to README.md

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
// import { PrepareLobe } from "tfjs-node-lambda-helpers";
import { PrepareLobe, isLambda } from "../src";

const baseUrl = isLambda() ? `https://${process.env.VERCEL_URL}` : `http://localhost:3000`
const prepareLobe = PrepareLobe(`${baseUrl}/static/model`)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const lobe = await prepareLobe.next();
  if (!lobe.done) {
    return res.status(lobe.value.statusCode).json(lobe.value);
  }
  const model = lobe.value;
  const imageUrl = req.body.imageUrl;

  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  const results = model.predict(response.data);

  return res.status(200).json({ results: results.Confidences });
};
