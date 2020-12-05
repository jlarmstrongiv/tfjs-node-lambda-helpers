import { isLambda } from './isLambda';
import { loadBinary } from './loadBinary';
import { loadTensorflow } from './loadTensorflow';
import { ReleaseOptions } from './getVersionUrl';
import loadTf from 'tfjs-node-lambda';

// https://javascript.info/async-iterators-generators#async-generators-finally
export async function* PrepareTf(options?: ReleaseOptions) {
  if (isLambda()) yield loadBinary(options);
  if (isLambda()) yield loadTensorflow();
  return loadTf() as typeof import('@tensorflow/tfjs');
}
