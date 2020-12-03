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

Important note: the lambda will return a `503 SERVICE_UNAVAILABLE` error until `tf` is fully loaded to prevent errors from timing out. On the client, simply retry the request until the lambda is ready.

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import loadTf from 'tfjs-node-lambda';
import {prepareTf} from 'tfjs-node-lambda-helpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const ready = await prepareTs.next();
  if (ready.value) {
    return res.status(ready.value.statusCode).json(ready.value);
  }

  const tf: typeof import('@tensorflow/tfjs') = await loadTf();

  tf.tensor([1, 2, 3, 4]).print();

  return res.status(200).json({ version: tf.version });
};
```

## Behind the scenes

The problems we are trying to solve:

- No configuration
- Fast development experience
- Lambda often times out on initial load

Read the [source code](https://github.com/jlarmstrongiv/tfjs-node-lambda-helpers#readme).
