import { version } from 'tfjs-node-lambda/package.json';
import { validateOptions } from './validateOptions';

export interface ReleaseOptions {
  tensorflowVersion?: string;
  nodeVersion?: string;
}

export function getVersionUrl(options: ReleaseOptions = {}): string {
  const { tensorflowVersion, nodeVersion } = validateOptions(options);

  return `https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v${version}/${nodeVersion}-tf${tensorflowVersion}.br`;
}
