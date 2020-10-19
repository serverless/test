// Warning: Needs to be required before any serverless modules are required!

'use strict';

const path = require('path');
const isModuleNotFoundError = require('ncjsm/is-module-not-found-error');

const resolveAreAnalyticsDisabled = (serverlessPath) => {
  let modulePath = path.join(serverlessPath, 'lib/utils/analytics/areDisabled');
  try {
    return require.resolve(modulePath);
  } catch (error) {
    if (!isModuleNotFoundError(error, modulePath)) throw error;
  }
  modulePath = path.join(serverlessPath, 'lib/utils/isTrackingDisabled');
  return require.resolve(modulePath);
};

module.exports = (serverlessPath) => {
  const modulePath = resolveAreAnalyticsDisabled(serverlessPath);
  // Ensure no tracking during tests run
  require.cache[require.resolve(modulePath)] = { exports: true };
};
