'use strict';

module.exports = () => {
  const env = { SLS_TRACKING_DISABLED: '1' };
  for (const varName of ['APPDATA', 'HOME', 'PATH', 'TMPDIR', 'USERPROFILE']) {
    if (process.env[varName]) env[varName] = process.env[varName];
  }
  return env;
};
