# async-leaks-detector

Ensures meaningful errors if there are async operations detected after all tests are reported to be finished.

When relying on Bluebird, the bluebird patch (`setup/async-leaks-detector/bluebird-patch`) also needs to be loaded.

## Setup

Ensure it's loaded via `require` mocha option, as configured in `package.json`:

```json
{
  "mocha": {
    "require": [
      "@serverless/test/setup/async-leaks-detector",
      "@serverless/test/setup/async-leaks-detector/bluebird-patch"
    ]
  }
}
```
