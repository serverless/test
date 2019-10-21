'use strict';

const createEnv = require('process-utils/create-env');

module.exports = () =>
  createEnv({
    whitelist: ['APPDATA', 'HOME', 'PATH', 'TMPDIR', 'USERPROFILE'],
    variables: { SLS_TRACKING_DISABLED: '1' },
  });
