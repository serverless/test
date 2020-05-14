// Temporary workaround, until Node.js has: https://github.com/nodejs/node/pull/31000

'use strict';

const nodeMajorVersion = Number(process.version.split('.')[0].slice(1));

if (nodeMajorVersion < 14) {
  module.exports = () => ({ restore: () => {} });
  return;
}

module.exports = () => {
  const processEmitWarning = process.emitWarning;
  process.emitWarning = (warning, ...args) => {
    if (
      typeof warning === 'string' &&
      warning.includes('of module exports inside circular dependency')
    ) {
      return;
    }
    processEmitWarning.call(this, warning, ...args);
  };
  return {
    restore: () => {
      process.emitWarning = processEmitWarning;
    },
  };
};
