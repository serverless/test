'use strict';

const ensureObject = require('type/object/ensure');
const ensurePlainObject = require('type/plain-object/ensure');
const ensureFunction = require('type/plain-function/ensure');
const sinon = require('sinon');

module.exports = (provider, config) => {
  ensureObject(provider);
  ensureFunction(provider.request);
  ensurePlainObject(config);

  if (provider.request.restore) provider.request.restore();

  return sinon.stub(provider, 'request').callsFake(
    (service, method) =>
      new Promise((resolve, reject) => {
        if (!config[service] || !config[service][method]) {
          reject(new Error(`Missing AWS request stub configuration for ${service}.${method}`));
          return;
        }

        const meth = config[service][method];
        resolve(typeof meth === 'function' ? meth() : meth);
      })
  );
};
