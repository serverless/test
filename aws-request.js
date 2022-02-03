'use strict';

const isPlainObject = require('type/plain-object/is');
const ensureConstructor = require('type/constructor/ensure');
const ensurePlainObject = require('type/plain-object/ensure');
const memoizeWeak = require('memoizee/weak');
const awsLog = require('log').get('aws');
const wait = require('timers-ext/promise/sleep');

const getClientInstance = memoizeWeak(
  (Client, options) => {
    const params = { region: 'us-east-1', ...options };
    return new Client(params);
  },
  { normalizer: (ignore, [options]) => JSON.stringify(options) }
);

const resolveClientData = (clientOrClientConfig) => {
  if (isPlainObject(clientOrClientConfig)) {
    return [
      ensureConstructor(clientOrClientConfig.client),
      ensurePlainObject(clientOrClientConfig.params, { default: {} }),
    ];
  }
  return [ensureConstructor(clientOrClientConfig), {}];
};

let lastAwsRequestId = 0;
module.exports = function awsRequest(clientOrClientConfig, method, ...args) {
  const requestId = ++lastAwsRequestId;
  awsLog.debug('[%d] %o %s %O', requestId, clientOrClientConfig, method, args);
  const instance = getClientInstance(...resolveClientData(clientOrClientConfig));
  return instance[method](...args)
    .promise()
    .then(
      (result) => {
        awsLog.debug('[%d] %O', requestId, result);
        return result;
      },
      (error) => {
        awsLog.debug('[%d] %O', requestId, error);
        if (error.statusCode !== 403 && error.retryable) {
          awsLog.debug('[%d] retry', requestId);
          return wait(4000 + Math.random() * 3000).then(() =>
            awsRequest(clientOrClientConfig, method, ...args)
          );
        }
        throw error;
      }
    );
};
