# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [5.2.0](https://github.com/serverless/test/compare/v5.1.0...v5.2.0) (2020-10-09)

### Features

- **Run Serverless:** Allow functions as AWS provider request stubs. ([#54](https://github.com/serverless/test/issues/54)) ([f065b47](https://github.com/serverless/test/commit/f065b47f166635a9b64baf5e0f7315e913fa26b2)) ([Ryan Roemer](https://github.com/ryan-roemer))

## [5.1.0](https://github.com/serverless/test/compare/v5.0.0...v5.1.0) (2020-09-08)

### Features

- **Fixtures Engine:** Support npm dependencies install ([0028b7e](https://github.com/serverless/test/commit/0028b7ecddbc815c3ae8f996d7e11d3f7a0dc22b)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.0.0](https://github.com/serverless/test/compare/v4.9.2...v5.0.0) (2020-09-08)

### ⚠ BREAKING CHANGES

- **Fixtures Engine:** `fixtures.map`, `fixtures.extend` were removed and `fixtures.setup` was redesigned to address all fixture setup cases. Now each fixture is copied to temporary folder, which is retured by `fixtures.setup`

### Features

- **Fixtures Engine:** Reconfigure and ntroduce single `fixtures.setup `([bf856ab](https://github.com/serverless/test/commit/bf856abcc228f8dd27e171859d739192e6004848))([Mariusz Nowak](https://github.com/medikoo))
- Set homedir as tmpdir in process tmpdir ([bba8078](https://github.com/serverless/test/commit/bba8078e40d2dd297fffbcaf1cbcac8995e73efd)) ([Mariusz Nowak](https://github.com/medikoo))

### [4.9.2](https://github.com/serverless/test/compare/v4.9.1...v4.9.2) (2020-09-04)

### Bug Fixes

- **Fixture Engine:** Fix fixture setup design ([12061ce](https://github.com/serverless/test/commit/12061ce24b18eace2a9187358237654dc05ab2d3)) ([Mariusz Nowak](https://github.com/medikoo))

### [4.9.1](https://github.com/serverless/test/compare/v4.9.0...v4.9.1) (2020-09-04)

### Bug Fixes

- **Run Serverless:** Ensure to recognize fallbacks to local installation ([f741602](https://github.com/serverless/test/commit/f741602a9ebd2b25abc7b618d38a1ec2e8ed1822)) ([Mariusz Nowak](https://github.com/medikoo))

## [4.9.0](https://github.com/serverless/test/compare/v4.8.0...v4.9.0) (2020-09-04)

### Features

- **Fixtures Engine:** Introduce fixtures.setup ([#53](https://github.com/serverless/test/pull/53)) ([d87f20f](https://github.com/serverless/test/commit/d87f20f88260d2ce5fb1d016f03f902ac99d109a)) ([Mariusz Nowak](https://github.com/medikoo))

### Bug Fixes

- **Fixtures Engine:** Support absolute paths in `extraPaths` ([#53](https://github.com/serverless/test/pull/53)) ([7990407](https://github.com/serverless/test/commit/79904078eeec24df3cfe893556d8cfc5494ad4f5)) ([Mariusz Nowak](https://github.com/medikoo))

## [4.8.0](https://github.com/serverless/test/compare/v4.7.0...v4.8.0) (2020-09-01)

### Features

- **Run Serverless:** Ensure `frameworkVersion` to not trigger validation error ([a35fb51](https://github.com/serverless/test/commit/a35fb51f5f0809a46823bc55f025ae0cb01c0041)) ([Mariusz Nowak](https://github.com/medikoo))

## [4.7.0](https://github.com/serverless/test/compare/v4.6.0...v4.7.0) (2020-08-31)

### Features

- **Run Serverless:** Ensure to reset triggeredDeprecations at each call ([3b5e351](https://github.com/serverless/test/commit/3b5e351c29a52635bdca69124eb9d8ad9180d571)) ([Mariusz Nowak](https://github.com/medikoo))

## [4.6.0](https://github.com/serverless/test/compare/v4.5.0...v4.6.0) (2020-08-19)

### Features

- **Mocha Isolated:** Pass through `--require` option to Mocha ([590f330](https://github.com/serverless/test/commit/590f33076208be841c2504769575dce6a8a305b1)) ([Mariusz Nowak](https://github.com/medikoo))

## [4.5.0](https://github.com/serverless/test/compare/v4.4.0...v4.5.0) (2020-08-18)

### Features

- **Run Serverless:** Throw config validation errors for inline configs ([c4b29c5](https://github.com/serverless/test/commit/c4b29c5a89ab301cf2b087c92982cb2db3cc6c02)) ([Mariusz Nowak](https://github.com/medikoo))

### Bug Fixes

- Ensure to ignore mock home dir cleanup with timed out tests ([582dd34](https://github.com/serverless/test/commit/582dd343b927e2f865e50efc8f4885c5df326967)) ([Mariusz Nowak](https://github.com/medikoo))

## [4.4.0](https://github.com/serverless/test/compare/v4.3.2...v4.4.0) (2020-08-07)

### Features

- `getFixturesEngine` util (secluded from `serverless`) ([#52](https://github.com/serverless/test/pull/52)) ([bdc03ea](https://github.com/serverless/test/commit/bdc03eade5f42d9a8ec13d2476bccc3122a554ac)) ([Mariusz Nowak](https://github.com/medikoo))

### [4.3.2](https://github.com/serverless/test/compare/v4.3.1...v4.3.2) (2020-07-22)

### Bug Fixes

- **Mocha Fixes:** Ensure to expose eventual uncaught exception ([4f9f47e](https://github.com/serverless/test/commit/4f9f47ed30dcb6c774ccd1cf99f3ba26f351c584)) ([Mariusz Nowak](https://github.com/medikoo))

### [4.3.1](https://github.com/serverless/test/compare/v4.3.0...v4.3.1) (2020-07-16)

### Bug Fixes

- **Async Leaks Detector:** Increase timeout to avoid false positives ([6f310e3](https://github.com/serverless/test/commit/6f310e34b9c9cd2ed70fd08d043b8c058a0cb75d)) ([Mariusz Nowak](https://github.com/medikoo))

## [4.3.0](https://github.com/serverless/test/compare/v4.2.0...v4.3.0) (2020-07-15)

### Features

- Ensure to whitelist SLS_AWS_REQUEST_MAX_RETRIES env var ([59262e6](https://github.com/serverless/test/commit/59262e65c991bb4a2d58fe6137fed31ac870d74e)) ([Mariusz Nowak](https://github.com/medikoo))

## [4.2.0](https://github.com/serverless/test/compare/v4.1.0...v4.2.0) (2020-07-08)

### Features

- **Run Serverless:** Provide access to aws naming on result object ([2578648](https://github.com/serverless/test/commit/25786480ca5216754ecab120b538b9d24a84d76d)) ([Mariusz Nowak](https://github.com/medikoo))

## [4.1.0](https://github.com/serverless/test/compare/v4.0.0...v4.1.0) (2020-07-08)

### Features

- **Run Serverless:** Provide access to generated CloudFormation template on result object ([7b25ceb](https://github.com/serverless/test/commit/7b25ceb1ea39068319eeabc6233904bd78b548c3)) ([Mariusz Nowak](https://github.com/medikoo))

## [4.0.0](https://github.com/serverless/test/compare/v3.9.0...v4.0.0) (2020-07-08)

### ⚠ BREAKING CHANGES

- **Run Serverless:** `runServerless` no longer resolves with `serverless` instance directly. Now data object is returned with `serverless` and `stdoutData` properties

### Features

- **Run Serverless:** Mute stdout and expose its content at `stdoutData` ([028c99c](https://github.com/serverless/test/commit/028c99ccd1ca360c11536c016434bb8d40d074f4))

## [3.9.0](https://github.com/serverless/test/compare/v3.8.1...v3.9.0) (2020-07-01)

### Features

- **Mocha:** `hasFailed` util ([#48](https://github.com/serverless/test/pull/48)) ([8a7f4ad](https://github.com/serverless/test/commit/8a7f4ad1980975d0449d6a72a00524d91f6b0e6d)) ([Mariusz Nowak](https://github.com/medikoo))

### [3.8.1](https://github.com/serverless/test/compare/v3.8.0...v3.8.1) (2020-06-23)

### Bug Fixes

- **Mocha Isolated:** Support documented -b option ([e8c1c25](https://github.com/serverless/test/commit/e8c1c25c84245d4f0e7b5c921f559f615def53d5)) ([Mariusz Nowak](https://github.com/medikoo))

## [3.8.0](https://github.com/serverless/test/compare/v3.7.0...v3.8.0) (2020-06-03)

### Features

- Handle internal rename in `serverless` of `lib/utils/isTrackingDisabled.js` into `lib/utils/anallytics/areDisabled.js` ([90d71a1](https://github.com/serverless/test/commit/90d71a1cb3cd7d4a72b30214a5626a718578fef3)) ([Mariusz Nowak](https://github.com/medikoo))

## [3.7.0](https://github.com/serverless/test/compare/v3.6.0...v3.7.0) (2020-05-14)

### Features

- Introduce `preventCircularDepPropertyWarning` util ([8482eb6](https://github.com/serverless/test/commit/8482eb69ceeb8348cd2c1df4794ccaa9aeca5054)) ([Mariusz Nowak](https://github.com/medikoo))

### Bug Fixes

- Ensure no buggy Node.js v14 warnings where mocks are processed ([dedaa64](https://github.com/serverless/test/commit/dedaa64935a4e2d6165481dfa13fd2fdbf70fb0e)) ([Mariusz Nowak](https://github.com/medikoo))

## [3.6.0](https://github.com/serverless/test/compare/v3.5.5...v3.6.0) (2020-04-15)

### Features

- `configureAwsRequestStub` util ([#26](https://github.com/serverless/test/pull/26)) ([40c0f57](https://github.com/serverless/test/commit/40c0f578dc3bece533bbdaa114b5089dc0e9a573)) ([Mariusz Nowak](https://github.com/medikoo))
- **Run Serverless:**
  - `awsRequestStubMap` option ([#26](https://github.com/serverless/test/pull/26)) ([859f97c](https://github.com/serverless/test/commit/859f97cd2d0d8a425b4fbe5ca7952988cdf555ba)) ([Mariusz Nowak](https://github.com/medikoo))
  - `lastLifecycleHookName` option ([#26](https://github.com/serverless/test/pull/26)) ([24b4bd3](https://github.com/serverless/test/commit/24b4bd330ab862879042401a7e7c9344f9eff18f)) ([Mariusz Nowak](https://github.com/medikoo))
  - `shouldStubSpawn` option ([#26](https://github.com/serverless/test/pull/26)) ([f6e3581](https://github.com/serverless/test/commit/f6e3581b1ef7b39a9fa9a06a3dda8a2689a349a1)) ([Mariusz Nowak](https://github.com/medikoo))

### [3.5.5](https://github.com/serverless/test/compare/v3.5.4...v3.5.5) (2020-04-05)

### [3.5.4](https://github.com/serverless/test/compare/v3.5.3...v3.5.4) (2020-03-20)

### Bug Fixes

- **Mocha Isolated:** Do not output progress list on lone test run ([1051a88](https://github.com/serverless/test/commit/1051a884507780814300a821694f82b09aaa41e5))

### [3.5.3](https://github.com/serverless/test/compare/v3.5.2...v3.5.3) (2020-02-20)

### Bug Fixes

- **Async Leaks Detector:** Bump timeout to avoid false positives ([9d51af2](https://github.com/serverless/test/commit/9d51af27680a8e34cf839d490b77ab43b06a929b))

### [3.5.2](https://github.com/serverless/test/compare/v3.5.1...v3.5.2) (2020-02-12)

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
