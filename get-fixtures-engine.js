'use strict';

const path = require('path');
const ensureString = require('type/string/ensure');
const ensurePlainObject = require('type/plain-object/ensure');
const BbPromise = require('bluebird');
const fse = require('fs-extra');
const memoizee = require('memoizee');
const { merge } = require('lodash');
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

const retrievedFixturesPaths = new Set();
const currentlySetupFixtures = new Set();
const retrievedFixturesCleanupInstructions = new Map();

const setupFixture = memoizee(
  (fixturePath) =>
    BbPromise.resolve(require(path.join(fixturePath, '_setup'))()).then((cleanupInstructions) => {
      currentlySetupFixtures.add(fixturePath);
      if (cleanupInstructions) {
        retrievedFixturesCleanupInstructions.set(fixturePath, cleanupInstructions);
      }
    }),
  { promise: true }
);

module.exports = memoizee((fixturesPath) => {
  const fixturesEngine = {
    map: new Proxy(
      {},
      {
        get: (obj, fixtureName) => {
          const fixturePath = path.join(fixturesPath, fixtureName);
          if (!isFixtureConfigured(fixturePath)) {
            throw new Error(`No fixture configured at ${fixtureName}`);
          }
          retrievedFixturesPaths.add(fixturePath);
          return fixturePath;
        },
      }
    ),
    setup: (fixtureName) =>
      BbPromise.try(() => {
        const fixturePath = path.join(fixturesPath, ensureString(fixtureName));
        if (!isFixtureConfigured(fixturePath)) {
          throw new Error(`No fixture configured at ${fixtureName}`);
        }

        return setupFixture(fixturePath).then(() => {
          retrievedFixturesPaths.add(fixturePath);
          return fixturePath;
        });
      }),
    extend: (fixtureName, extConfig) =>
      BbPromise.try(() => {
        const baseFixturePath = path.join(fixturesPath, ensureString(fixtureName));
        if (!isFixtureConfigured(baseFixturePath)) {
          throw new Error(`No fixture configured at ${fixtureName}`);
        }

        ensurePlainObject(extConfig);
        return Promise.all([
          provisionTmpDir(),
          fse.lstat(path.resolve(baseFixturePath, '_setup.js')).then(
            (stats) => {
              if (!stats.isFile()) return null;
              return fixturesEngine.setup(fixtureName);
            },
            (error) => {
              if (error.code !== 'ENOENT') throw error;
            }
          ),
        ]).then(([fixturePath]) => {
          return Promise.all([
            fse.readFile(path.join(baseFixturePath, 'serverless.yml')),
            fse.copy(baseFixturePath, fixturePath),
          ])
            .then(([yamlConfig]) =>
              fse.writeFile(
                path.join(fixturePath, 'serverless.yml'),
                saveYaml(merge(loadYaml(yamlConfig), extConfig))
              )
            )
            .then(() => fixturePath);
        });
      }),
    cleanup: (options = {}) =>
      Promise.all(
        Array.from(retrievedFixturesPaths, (fixturePath) => {
          const pathsToRemove = [path.join(fixturePath, '.serverless')];
          if (options.extraPaths) {
            pathsToRemove.push(
              ...options.extraPaths.map((target) => path.resolve(fixturePath, target))
            );
          }
          const cleanupInstructions = retrievedFixturesCleanupInstructions.get(fixturePath);
          if (cleanupInstructions && cleanupInstructions.pathsToRemove) {
            pathsToRemove.push(
              ...cleanupInstructions.pathsToRemove.map((target) =>
                path.resolve(fixturePath, target)
              )
            );
          }
          return Promise.all(pathsToRemove.map((pathToRemove) => fse.remove(pathToRemove))).then(
            () => {
              retrievedFixturesPaths.delete(fixturePath);
              setupFixture.clear(fixturePath);
            }
          );
        })
      ),
  };
  return fixturesEngine;
});
