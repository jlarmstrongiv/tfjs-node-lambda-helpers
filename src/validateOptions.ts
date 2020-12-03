import matrix from 'tfjs-node-lambda/matrix.json';

export function validateOptions(options: {
  tensorflowVersion?: string;
  nodeVersion?: string;
}) {
  // check for node version, or set as environment default
  if (!options.nodeVersion) {
    const currentNodeVersion = process.versions.node.split('.')[0];
    const environmentNodeVersion = matrix.lambda.find(lambdaVersion =>
      lambdaVersion.includes(currentNodeVersion),
    );
    if (!environmentNodeVersion)
      throw new Error('[tfjs-node-lambda-helpers]: Unsupported node version');

    options.nodeVersion = environmentNodeVersion;
  }

  // default to first cdn
  // options.cdn ?? (options.cdn = cdns[0]);

  // default to latest tensorflow version
  options.tensorflowVersion ??
    (options.tensorflowVersion =
      matrix.tensorflow[matrix.tensorflow.length - 1]);

  // throw errors if any options are invalid
  if (!matrix.tensorflow.includes(options.tensorflowVersion))
    throw new Error(
      `[tfjs-node-lambda-helpers]: Invalid tensorflow version "${
        options.tensorflowVersion
      }". Valid versions are ${JSON.stringify(matrix.tensorflow)}`,
    );

  if (!matrix.lambda.includes(options.nodeVersion))
    throw new Error(
      `[tfjs-node-lambda-helpers]: Invalid node version "${
        options.nodeVersion
      }". Valid versions are ${JSON.stringify(matrix.lambda)}`,
    );

  // if (!cdns.includes(options.cdn))
  //   throw new Error(
  //     `[tfjs-node-lambda-helpers]: Invalid cdn "${
  //       options.cdn
  //     }". Valid cdns are ${JSON.stringify(cdns)}`,
  //   );

  return options;
}
