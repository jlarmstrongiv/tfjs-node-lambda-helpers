import matrix from 'tfjs-node-lambda/matrix.json';

export function getReleases(): string[] {
  let versions: string[] = [];
  matrix.lambda.forEach(lambdaVersion => {
    matrix.tensorflow.forEach(tensorflowVersion => {
      versions.push(`${lambdaVersion}-tf${tensorflowVersion}`);
    });
  });
  return versions;
}
