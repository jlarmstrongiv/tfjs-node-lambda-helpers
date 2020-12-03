import { version } from 'tfjs-node-lambda/package.json';
import { validateOptions } from './validateOptions';

export function getVersionUrl(
  options: {
    tensorflowVersion?: string;
    nodeVersion?: string;
  } = {},
): string {
  const { tensorflowVersion, nodeVersion } = validateOptions(options);

  return `https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v${version}/${nodeVersion}-tf${tensorflowVersion}.br`;
}
