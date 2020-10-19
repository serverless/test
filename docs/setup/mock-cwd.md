# mock-cwd

1. Sets current working directory to home directory (which with [mock-homedir](./mock-homedir.md) extension will point temp directory)
2. After each top level test run restores current working directory to initial state

## Setup

Ensure it's loaded via mocha `require` option, as configured in `package.json`:

```json
{
  "mocha": {
    "require": ["@serverless/test/setup/mock-cwd"]
  }
}
```
