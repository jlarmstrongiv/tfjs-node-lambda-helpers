import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import axios from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import loadTf from 'tfjs-node-lambda';
import { isLambda } from './isLambda';
import { getVersionUrl } from './getVersionUrl';

// https://javascript.info/async-iterators-generators#async-generators-finally
async function* PrepareTf() {
  if (isLambda()) yield loadBinary();
  if (isLambda()) yield loadInitial();
}

async function loadBinary() {
  const response = await axios.get(getVersionUrl(), {
    responseType: 'arraybuffer',
  });

  await fs.outputFile(path.join(os.tmpdir(), 'tfjs-node.br'), response.data);

  return {
    statusCode: StatusCodes.SERVICE_UNAVAILABLE,
    reason: ReasonPhrases.SERVICE_UNAVAILABLE,
    message: 'Loaded binary',
  };
}

async function loadInitial() {
  await loadTf();
  // cleanup
  await fs.remove(path.join(os.tmpdir(), 'tfjs-node.br'));

  return {
    statusCode: StatusCodes.SERVICE_UNAVAILABLE,
    reason: ReasonPhrases.SERVICE_UNAVAILABLE,
    message: 'Initial load',
  };
}

export const prepareTf = PrepareTf();
