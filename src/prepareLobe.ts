import { isLambda } from './isLambda';
import { loadBinary } from './loadBinary';
import { loadTensorflow } from './loadTensorflow';
import { loadLobeModel } from './loadLobeModel';

export async function* PrepareLobe(modelDirectory: string) {
  if (isLambda()) yield loadBinary();
  if (isLambda()) yield loadTensorflow();
  return loadLobeModel(modelDirectory);
}
