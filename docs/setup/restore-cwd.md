# restore-cwd

After each top level test run restores current working directory to initial state

## Setup

Ensure it's loaded via mocha `require` option, as configured in `package.json`:

```json
{
  "mocha": {
    "require": ["@serverless/test/setup/restore-cwd"]
  }
}
```
