'use strict';

const _ = require('lodash');
const AWS = require('aws-sdk');
const awsLog = require('log').get('aws');
const wait = require('timers-ext/promise/sleep');

const getServiceInstance = _.memoize(
  nameInput => {
    const params = Object.assign({ region: 'us-east-1' }, nameInput.params);
    const name = typeof nameInput === 'string' ? nameInput : nameInput.name;
    const Service = _.get(AWS, name);
    return new Service(params);
  },
  nameInput => {
    return typeof nameInput === 'string' ? nameInput : JSON.stringify(nameInput);
  }
);

let lastAwsRequestId = 0;
module.exports = function awsRequest(service, method, ...args) {
  const requestId = ++lastAwsRequestId;
  awsLog.debug('[%d] %o %s %O', requestId, service, method, args);
  const instance = getServiceInstance(service);
  return instance[method](...args)
    .promise()
    .then(
      result => {
        awsLog.debug('[%d] %O', requestId, result);
        return result;
      },
      error => {
        awsLog.debug('[%d] %O', requestId, error);
        if (error.statusCode !== 403 && error.retryable) {
          awsLog.debug('[%d] retry', requestId);
          return wait(4000 + Math.random() * 3000).then(() => awsRequest(service, method, ...args));
        }
        throw error;
      }
    );
};
