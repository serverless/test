// Warning: Needs to be required before any serverless modules are required!

'use strict';

const path = require('path');

module.exports = serverlessPath => {
  const modulePath = path.join(serverlessPath, 'lib/utils/isTrackingDisabled');
  // eslint-disable-next-line import/no-unresolved
  const isTrackingDisabled = require(modulePath);

  if (!isTrackingDisabled) {
    // Ensure no tracking during tests run
    require.cache[require.resolve(modulePath)].exports = true;
  }
};
