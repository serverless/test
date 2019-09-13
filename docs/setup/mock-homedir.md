# mock-homedir

Patches home dir path into temp dir (to not mess in real user homedir)

## Setup

Ensure it's loaded via mocha `require` option, as configured in `package.json`:

```json
{
  "mocha": {
    "require": ["@serverless/test/setup/mock-homedir"]
  }
}
```
