'use strict';

const path = require('path');
const ensureString = require('type/string/ensure');
const ensurePlainObject = require('type/plain-object/ensure');
const ensurePlainFunction = require('type/plain-function/ensure');
const spawn = require('child-process-ext/spawn');
const BbPromise = require('bluebird');
const fse = require('fs-extra');
const memoizee = require('memoizee');
const { merge } = require('lodash');
const log = require('log').get('serverless:test');
const { load: loadYaml, dump: saveYaml } = require('js-yaml');
const provisionTmpDir = require('./provision-tmp-dir');

const isFixtureConfigured = memoizee((fixturePath) => {
  let stats;
  try {
    stats = fse.statSync(fixturePath);
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
  return Boolean(stats.isDirectory());
});

const isFile = (filename) =>
  fse.lstat(filename).then(
    (stats) => {
      if (!stats.isFile()) return false;
      return true;
    },
    (error) => {
      if (error.code === 'ENOENT') return false;
      throw error;
    }
  );

const setupFixture = memoizee(
  (fixturePath) =>
    Promise.all([
      isFile(path.resolve(fixturePath, '_setup.js')),
      isFile(path.resolve(fixturePath, 'package.json')),
    ]).then(([hasSetupScript, hasNpmDependencies]) => {
      if (!hasSetupScript && !hasNpmDependencies) return fixturePath;
      return provisionTmpDir().then((setupFixturePath) => {
        return fse
          .copy(fixturePath, setupFixturePath)
          .then(() => {
            if (!hasNpmDependencies) return null;
            log.notice(
              'install dependencies for %s (at %s)',
              path.basename(fixturePath),
              setupFixturePath
            );
            return spawn('npm', ['install'], { cwd: setupFixturePath });
          })
          .then(() => {
            if (!hasSetupScript) return null;
            log.notice('run setup for %s (at %s)', path.basename(fixturePath), setupFixturePath);
            const setupScriptPath = path.resolve(setupFixturePath, '_setup.js');
            return Promise.resolve(
              ensurePlainFunction(require(setupScriptPath))(fixturePath)
            ).then(() => fse.unlink(setupScriptPath));
          })
          .then(() => setupFixturePath);
      });
    }),
  { promise: true }
);

const nameTimeBase = new Date(2020, 8, 7).getTime();

module.exports = memoizee((fixturesPath) => {
  const fixturesEngine = {
    setup: (fixtureName, options = {}) =>
      BbPromise.try(() => {
        const baseFixturePath = path.join(fixturesPath, ensureString(fixtureName));
        if (!isFixtureConfigured(baseFixturePath)) {
          throw new Error(`No fixture configured at ${fixtureName}`);
        }
        if (!options) options = {};

        return Promise.all([provisionTmpDir(), setupFixture(baseFixturePath)]).then(
          ([fixturePath, setupFixturePath]) => {
            let configObject;
            return Promise.all([
              fse.readFile(path.join(setupFixturePath, 'serverless.yml')).catch((error) => {
                if (error.code === 'ENOENT') return null;
                throw error;
              }),
              fse.copy(setupFixturePath, fixturePath),
            ])
              .then(([configContent]) => {
                if (!configContent) return null;
                configObject = (() => {
                  try {
                    return loadYaml(configContent);
                  } catch (error) {
                    return null;
                  }
                })();
                if (!configObject) return null;
                if (!configObject.service && !options.configExt) return null;

                configObject.service = `test-${fixtureName}-${(Date.now() - nameTimeBase).toString(
                  32
                )}`;
                if (options.configExt) configObject = merge(configObject, options.configExt);

                return fse.writeFile(
                  path.join(fixturePath, 'serverless.yml'),
                  saveYaml(configObject)
                );
              })
              .then(() => {
                log.info('setup %s fixture at %s', fixtureName, fixturePath);
                return {
                  servicePath: fixturePath,
                  serviceConfig: configObject,
                  updateConfig: (configExt) => {
                    ensurePlainObject(configExt);
                    merge(configObject, configExt);
                    return fse.writeFile(
                      path.join(fixturePath, 'serverless.yml'),
                      saveYaml(configObject)
                    );
                  },
                };
              });
          }
        );
      }),
  };
  return fixturesEngine;
});
