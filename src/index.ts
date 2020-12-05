import matrix from 'tfjs-node-lambda/matrix.json';

// Package size exceeded the configured limit of 100 MB.
// https://cdn.jsdelivr.net/npm/tfjs-node-lambda-releases@1.5.0/nodejs10.x-tf1.7.4.br

// HTTP ERROR 500 unpkg.com is currently unable to handle this request.
// http://unpkg.com/tfjs-node-lambda-releases@1.5.0/nodejs10.x-tf1.7.4.br

// 200 success
// https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v1.5.0/nodejs10.x-tf1.7.4.br

// export const cdns = ['github', 'jsdelivr', 'unpkg'];
export const nodeVersions = matrix.lambda;
export const tensorflowVersions = matrix.tensorflow;
export { PrepareTf } from './prepareTf';
export { PrepareLobe } from './prepareLobe';
export { isLambda } from './isLambda';
export { LobeModel } from './lobeModel';
