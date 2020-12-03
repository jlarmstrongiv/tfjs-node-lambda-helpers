export function isLambda() {
  // check for `now dev` environment first
  // because `now dev` sets AWS_LAMBDA_FUNCTION_NAME
  if (process.env.NOW_REGION === 'dev1') return false;

  return Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
}
