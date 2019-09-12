'use strict';

// Speed up Bluebird's unhandled rejection notifications so it's on par with timing
// we observe with native promises, and so they do not interfere with an async leaks detector
const BbPromise = require('bluebird'); // eslint-disable-line import/no-unresolved
/* eslint-disable no-underscore-dangle */
BbPromise.prototype._ensurePossibleRejectionHandled = function() {
  if ((this._bitField & 524288) !== 0) return;
  this._setRejectionIsUnhandled();
  process.nextTick(() => this._notifyUnhandledRejection());
};
/* eslint-enable */
