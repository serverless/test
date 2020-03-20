# log

Configure log writter to expose logs written via [log](https://github.com/medikoo/log#log) utility.

By default (when no logging configuration is found in enviroment) all emitted logs (down to _debug_ level) are observed
and output in case of test failure.

## Setup

Ensure it's loaded via `require` mocha option, as configured in `package.json`:

```json
{
  "mocha": {
    "require": ["@serverless/test/setup/log"]
  }
}
```
