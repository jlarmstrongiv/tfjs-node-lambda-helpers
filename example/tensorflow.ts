// Mirror updates to README.md

import type { NextApiRequest, NextApiResponse } from "next";
// import { PrepareTf } from "tfjs-node-lambda-helpers";
import { PrepareTf } from "../src/";
const prepareTf = PrepareTf()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const ready = await prepareTf.next();
  if (!ready.done) {
    return res.status(ready.value.statusCode).json(ready.value);
  }
  const tf = ready.value;

  tf.tensor([1, 2, 3, 4]).print();

  return res.status(200).json({ version: tf.version });
};
