# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.5.1](https://github.com/serverless/test/compare/v3.5.0...v3.5.1) (2020-01-22)

### Bug Fixes

- Do not crash during Mocha event propagation ([e2ff7c6](https://github.com/serverless/test/commit/e2ff7c6097956e8016a9587d496d549ce5284be8))
- **Mocha Fixes:** Ensure to expose uncaught exceptions after fails ([281616b](https://github.com/serverless/test/commit/281616b36773b36086f17bcaa5e8c8f474631276))

## [3.5.0](https://github.com/serverless/test/compare/v3.4.0...v3.5.0) (2020-01-20)

### Features

- **Mocha Isolated:** In multi process run live output last test run ([3abf05e](https://github.com/serverless/test/commit/3abf05eeac743b38b95f2a307f5df38531acfd61))

## [3.4.0](https://github.com/serverless/test/compare/v3.3.1...v3.4.0) (2020-01-13)

### Features

- `awsRequest` util ([85f9a84](https://github.com/serverless/test/commit/85f9a84c00e9b41fd36ba8a9ff235d5c917440cd))
- Recognize dashboard test setup env vars ([69659bf](https://github.com/serverless/test/commit/69659bf3fb0b4a9271916170047df13b32567eb2))

### [3.3.1](https://github.com/serverless/test/compare/v3.3.0...v3.3.1) (2020-01-10)

### Bug Fixes

- **Mocha Fixes:** Fix mocha process 'exit' listener detection ([7d494af](https://github.com/serverless/test/commit/7d494afb07f5fcc56e328e770488533734f728b3))
- Do not hard crash on async leaks detection ([d834e22](https://github.com/serverless/test/commit/d834e226344412d5fee814c4d62a457191a9921a))

## [3.3.0](https://github.com/serverless/test/compare/v3.2.2...v3.3.0) (2019-12-20)

### Features

- **Log:** Ensure timestamps by logs ([bc268d0](https://github.com/serverless/test/commit/bc268d08652805610abd186e8d086be5ce0bc798))

### [3.2.2](https://github.com/serverless/test/compare/v3.2.1...v3.2.2) (2019-12-13)

### Bug Fixes

- Increase async leaks detector timeout ([a882845](https://github.com/serverless/test/commit/a88284576d6954755edeff0b51ca50c17544e25a))
- **Mocha Isolated:** To avoid confusion do not crash non 1 error codes ([6759893](https://github.com/serverless/test/commit/6759893ad0a7a9d0bad188afb289122c40dd6277))

### [3.2.1](https://github.com/serverless/test/compare/v3.2.0...v3.2.1) (2019-12-13)

### Bug Fixes

- **Mocha Isolated:** Ensure to validate options not path arguments ([770d171](https://github.com/serverless/test/commit/770d171688b6fd9520aeda0a556064e344e1926d))

## [3.2.0](https://github.com/serverless/test/compare/v3.1.0...v3.2.0) (2019-12-13)

### Features

- **Mocha Isolated:** Allow to customize number of workers ([cd9892a](https://github.com/serverless/test/commit/cd9892a2f282dceab0e47d57b3e7865db61d4dc5))

## [3.1.0](https://github.com/serverless/test/compare/v3.0.0...v3.1.0) (2019-12-12)

### Features

- `restore-env` mocha setup extension ([9894fb1](https://github.com/serverless/test/commit/9894fb16676b2630f17bc65d217149542f526ca4))

## [3.0.0](https://github.com/serverless/test/compare/v2.5.0...v3.0.0) (2019-11-19)

### Features

- **Run Serverless:**:
  - Pass Serverless constructor and cwd to `before` hook ([d0e0530](https://github.com/serverless/test/commit/d0e0530))
  - Replace whitelist approach with blacklist one ([b1faeb9](https://github.com/serverless/test/commit/b1faeb9))

### BREAKING CHANGES

- **Run Serverless:** `pluginPathsWhitelist` and `lifecycleHookNamesWhitelist` options were
  removed in favor of `pluginPathsBlacklist` and
  `lifecycleHookNamesBlacklist`

## [2.5.0](https://github.com/serverless/test/compare/v2.4.0...v2.5.0) (2019-11-08)

### Bug Fixes

- Increase async leaks detector wait gap ([5cc991c](https://github.com/serverless/test/commit/5cc991c))

### Features

- **Mocha Isolated:**:
  - --bail' option to abort after first fail ([d0c7a3a](https://github.com/serverless/test/commit/d0c7a3a))
  - Do not hard exit process on test fail ([3b86bea](https://github.com/serverless/test/commit/3b86bea))
  - Output stdout and stderr of finalized test in sync ([77de37a](https://github.com/serverless/test/commit/77de37a))
- **Run Serverless:**
  - Whitelist SERVERLESS_BINARY_PATH env var ([a767b67](https://github.com/serverless/test/commit/a767b67))

## [2.4.0](https://github.com/serverless/test/compare/v2.3.0...v2.4.0) (2019-10-23)

### Features

- **Log:**
  - Improve Mocha test boundary logs ([2f34d89](https://github.com/serverless/test/commit/2f34d89))
  - Prevent writing cumulated logs if there's only mocha logs ([3cf086b](https://github.com/serverless/test/commit/3cf086b))

## [2.3.0](https://github.com/serverless/test/compare/v2.2.0...v2.3.0) (2019-10-22)

### Features

- **Log:** Mark _suite_ and _test_ start in logs ([c5dd212](https://github.com/serverless/test/commit/c5dd212))

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
