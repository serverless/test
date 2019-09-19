# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
