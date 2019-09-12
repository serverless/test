'use strict';

// eslint-disable-next-line import/no-unresolved
const isTrackingDisabled = require('serverless/lib/utils/isTrackingDisabled');

if (!isTrackingDisabled) {
  // Ensure no tracking during tests run
  require.cache[require.resolve('serverless/lib/utils/isTrackingDisabled')].exports = true;
}
