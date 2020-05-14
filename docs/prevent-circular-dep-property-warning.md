# prevent-circular-dep-property-warning

In tests we mock modules with variants that expose subset of properties, additionally modules cache is tweaked so new require's that points those modules exports mocks and not original exports.

This actually provokes nasty warnings with Node.js v14. Complained about it here:
https://github.com/nodejs/node/pull/31000#issuecomment-628502264

Until it's fixed on Node.js side, or a solution to limit just this warning is introduced, this patch is needed to.

Usage:

```javascript
const preventCircularDepPropertyWarning = require('@serverless/test/prevent-circular-dep-property-warning');

// Initialize right before mocks are processed
const { restore: restoreProcessWarnings } = preventCircularDepPropertyWarning();
// .. mocks processing
restoreProcessWarnings(); // Restore original warnings state
```
