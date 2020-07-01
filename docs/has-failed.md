# has-failed

Answers whether any tests in passed suite failed. Useful when we want to abort cleanup in `after`
after a test fail, to enable further investigation.

```javascript
const hasFailed = require('@serverless/test/has-failed');

describe('Some suite', () => {
  after(function () {
    if (hasFailed(this.test.parent)) return; // Avoid cleanup
    // .. cleanup ..
  });

  // Tests
});
```
