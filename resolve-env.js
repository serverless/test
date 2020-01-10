'use strict';

const createEnv = require('process-utils/create-env');

module.exports = (options = {}) => {
  if (!options) options = {};
  return createEnv({
    whitelist: [
      'APPDATA',
      'HOME',
      'PATH',
      'SERVERLESS_BINARY_PATH',
      'TMPDIR',
      'USERPROFILE',
    ].concat(options.whitelist || []),
    variables: Object.assign({ SLS_TRACKING_DISABLED: '1' }, options.variables || {}),
  });
};
