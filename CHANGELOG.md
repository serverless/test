# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.2.0](https://github.com/serverless/test/compare/v2.1.0...v2.2.0) (2019-10-21)

### Bug Fixes

- **Run Serverless:**
  - Do not assign 'undefined' value to env var ([a928602](https://github.com/serverless/test/commit/a928602))

### Features

- **Run Serverless:**
  - `envWhitelist` option ([ad6e047](https://github.com/serverless/test/commit/ad6e047))
  - Validate eventually passed 'env' option ([6cee5ae](https://github.com/serverless/test/commit/6cee5ae))
- `resolveAwsEnv` util ([2eb4630](https://github.com/serverless/test/commit/2eb4630))
- `resolveEnv` util ([c5856e7](https://github.com/serverless/test/commit/c5856e7))
- Log writing setup option ([4e02245](https://github.com/serverless/test/commit/4e02245))

## [2.1.0](https://github.com/serverless/test/compare/v2.0.0...v2.1.0) (2019-10-15)

### Features

- `provision-tmp-dir` util ([6954597](https://github.com/serverless/test/commit/6954597))
- **Inquirer Stub:**
  - Auto reset eventual previous stub ([ae048ec](https://github.com/serverless/test/commit/ae048ec))
  - Stub `createPromptModule` ([8331c08](https://github.com/serverless/test/commit/8331c08))
  - Support prompt collections ([edf29aa](https://github.com/serverless/test/commit/edf29aa))
- **Run Serverless:**
  - Support `config` option, as an alternative to `cwd` ([6362b23](https://github.com/serverless/test/commit/6362b23))
  - Confirm whitelisted lifecycle hooks were executed ([76c66b6](https://github.com/serverless/test/commit/76c66b6))
  - Ensure whitelisted lifecycle hooks are recognized ([3f1f7f3](https://github.com/serverless/test/commit/3f1f7f3))
  - Ensure whitelisted plugins exist ([fd7a222](https://github.com/serverless/test/commit/fd7a222))
  - Support relative plugin paths ([95766e9](https://github.com/serverless/test/commit/95766e9))
  - Validate input arguments ([2ec470d](https://github.com/serverless/test/commit/2ec470d))
  - Validate input serverlessPath ([2e9419f](https://github.com/serverless/test/commit/2e9419f))
  - Validate paths of whitelisted plugins upfront ([cc85e5b](https://github.com/serverless/test/commit/cc85e5b))

## [2.0.0](https://github.com/serverless/test/compare/v1.0.0...v2.0.0) (2019-09-19)

### Bug Fixes

- Cleanup homedir only after top suite run finalizes ([523f48d](https://github.com/serverless/test/commit/523f48d))
- Support validation for 'password' type in inquirer stub ([bcbcf4c](https://github.com/serverless/test/commit/bcbcf4c))

### Features

- Support `hooks` in _run-serverless_ util ([c385862](https://github.com/serverless/test/commit/c385862))

### refactor

- Rename `hookNamesWhitelist` _run-serverless_ option ([9df7313](https://github.com/serverless/test/commit/9df7313))

### BREAKING CHANGES

- In _run-serveless_ util `hookNamesWhitelist` option was renamed to
  `lifecycleHookNamesWhitelist`.
  It's to not confuse it with `hooks` option (which is not about lifecycle hooks)

## 1.0.0 (2019-09-13)

Initial implementation, derived from [serveress](https://github.com/serverless/serverless/) codebase.

## Patched Mocha runner with extensions

- Custom mocha reporter ([866dac3](https://github.com/serverless/test/commit/866dac3))
- Async leaks detector ([ec0bcb6](https://github.com/serverless/test/commit/ec0bcb6))
- Mock homedir util ([94f2d2c](https://github.com/serverless/test/commit/94f2d2c))
- Restore cwd util ([0a72a11](https://github.com/serverless/test/commit/0a72a11))
- Skip with Notice utils ([2eb252f](https://github.com/serverless/test/commit/2eb252f))

## Binaries

- 'mocha-isolated' ([3822b40](https://github.com/serverless/test/commit/3822b40))

### Utilties

- Run serverless util ([32f5429](https://github.com/serverless/test/commit/32f5429))
- Configure inquirer stub util ([664982e](https://github.com/serverless/test/commit/664982e))
- Disable serverless stats requests util ([834b627](https://github.com/serverless/test/commit/834b627))
