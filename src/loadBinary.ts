import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import axios from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { getVersionUrl, ReleaseOptions } from './getVersionUrl';

export async function loadBinary(options?: ReleaseOptions) {
  const response = await axios.get(getVersionUrl(options), {
    responseType: 'arraybuffer',
  });

  await fs.outputFile(path.join(os.tmpdir(), 'tfjs-node.br'), response.data);

  return {
    statusCode: StatusCodes.SERVICE_UNAVAILABLE,
    reason: ReasonPhrases.SERVICE_UNAVAILABLE,
    message: 'Loaded binary',
  };
}
