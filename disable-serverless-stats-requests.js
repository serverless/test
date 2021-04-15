// Warning: Needs to be required before any serverless modules are required!

'use strict';

const path = require('path');

const resolveAreAnalyticsDisabled = (serverlessPath) => {
  for (const modulePath of ['lib/utils/telemetry/areDisabled', 'lib/utils/analytics/areDisabled']) {
    try {
      return require.resolve(modulePath);
    } catch {
      // Pass
    }
  }

  const modulePath = path.join(serverlessPath, 'lib/utils/isTrackingDisabled');
  return require.resolve(modulePath);
};

module.exports = (serverlessPath) => {
  const modulePath = resolveAreAnalyticsDisabled(serverlessPath);
  // Ensure no tracking during tests run
  require.cache[require.resolve(modulePath)] = { exports: true };
};
