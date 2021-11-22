# observe-output

Observes and resolves output as registered via [`writeText`](https://github.com/serverless/utils/blob/master/docs/log.md#writetexttexttoken-texttokens-interface-to-write-final-outcome-of-the-command).

Helpful in testing that expected output was generated by given functionality.

```javascript
const observeOputut = require('@serverless/test/observe-output');

const output = await observeOutput(async () => {
  // Run functionality that internally registers via `writeText`
});
```