# restore-env

After each top level test run restores `process.env` to state from begin of test run

## Setup

Ensure it's loaded via mocha `require` option, as configured in `package.json`:

```json
{
  "mocha": {
    "require": ["@serverless/test/setup/restore-env"]
  }
}
```
