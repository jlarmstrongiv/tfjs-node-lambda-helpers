const tasks = t => t.join(' && ');

module.exports = {
  hooks: {
    'pre-commit': tasks([
      // https://stackoverflow.com/a/60464514
      // lobeModel.ts
      // prettier-ignore error
      // Parsing error: '=' expected  prettier/prettier
      // 'tsdx lint src',
      'lint-staged',
      'npx cspell -- --no-summary $(git diff --cached --name-only)',
    ]),
    'prepare-commit-msg': 'exec < /dev/tty && git cz --hook || true',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
};
