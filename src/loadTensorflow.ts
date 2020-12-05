import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import loadTf from 'tfjs-node-lambda';

export async function loadTensorflow() {
  await loadTf(fs.createReadStream(path.join(os.tmpdir(), 'tfjs-node.br')));
  // cleanup
  await fs.remove(path.join(os.tmpdir(), 'tfjs-node.br'));

  return {
    statusCode: StatusCodes.SERVICE_UNAVAILABLE,
    reason: ReasonPhrases.SERVICE_UNAVAILABLE,
    message: 'Initial load',
  };
}
