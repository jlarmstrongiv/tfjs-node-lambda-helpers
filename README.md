# tfjs-node-lambda-helpers

When using `tfjs-node-lambda`, you have to deal with environments, release urls, releases, and timeouts. This package takes care of all of that for you.

## Installation

```bash
npm install --save --save-exact tfjs-node-lambda tfjs-node-lambda-helpers
npm install --save-dev --save-exact tfjs-node-lambda-releases @tensorflow/tfjs-node @tensorflow/tfjs
```

### Related libraries

- [tfjs-node-lambda](https://www.npmjs.com/package/tfjs-node-lambda)
- [tfjs-node-lambda-releases](https://www.npmjs.com/package/tfjs-node-lambda-releases)
- [tfjs-node-lambda-helpers](https://www.npmjs.com/package/tfjs-node-lambda-helpers)
- [@tensorflow/tfjs-node](https://www.npmjs.com/package/@tensorflow/tfjs-node)
- [@tensorflow/tfjs](https://www.npmjs.com/package/@tensorflow/tfjs)

## Usage

Please note that the lambda will return a `503 SERVICE_UNAVAILABLE` error until `tf` is fully loaded to prevent errors from timing out. On the client, simply retry the request until the lambda is ready.

### Tensorflow

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrepareTf } from "tfjs-node-lambda-helpers";
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
```

### Lobe.ai

In Vercel’s dashboard, be sure `Settings > Environment Variables > Automatically expose System Environment Variables` is checked so that `process.env.VERCEL_URL` is not undefined.

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { PrepareLobe, isLambda } from "tfjs-node-lambda-helpers";

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
```

## Behind the scenes

Our goals:

- No configuration
- Fast development experience
- Prevent Lambda from timing out on initial load

Read the [source code](https://github.com/jlarmstrongiv/tfjs-node-lambda-helpers#readme).
