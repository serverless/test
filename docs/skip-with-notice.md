# skip-with-notice

Skip given test, and ensure proper notice will be displayed for developer with final tests summary

Example usage:

```javascript
const skipWithNotice = require('@serverless/test/skip-with-notice');

describe('Some suite', () => {
  it('Some test that involves optional runtime', function () {
    invokePython().catch((error) => {
      if (error.code === 'ENOENT' && error.path === 'python2') {
        skipWithNotice(this, 'Python runtime is not installed');
      }
      throw error;
    });
  });
});
```
