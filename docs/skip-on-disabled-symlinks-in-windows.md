# skip-on-disabled-symlinks-in-windows

Preconfigured [`skip-with-notice`](skip-with-notice.md) usage to skip on Windows symlink errors.

Usage:

```javascript
const skipOnDisabledSymlinksInWindows = require('@serverless/test/skip-on-disabled-symlinks-in-windows');

describe('Some suite', () => {
  it('Some test that involves symlinks creation', function () {
    ensureSymlink(realFilePath, symlinkPath).catch((error) => {
      skipOnWindowsDisabledSymlinks(error, this);
      throw error;
    });
  });
});
```
