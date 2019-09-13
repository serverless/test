'use strict';

const { entries, values } = require('lodash');
const overrideEnv = require('process-utils/override-env');
const overrideCwd = require('process-utils/override-cwd');
const overrideArgv = require('process-utils/override-argv');
const disableServerlessStatsRequests = require('./disable-serverless-stats-requests');

const resolveServerless = (serverlessPath, modulesCacheStub, callback) => {
  if (!modulesCacheStub) {
    disableServerlessStatsRequests(serverlessPath);
    return callback(require(serverlessPath));
  }
  const originalCache = Object.assign({}, require.cache);
  for (const key of Object.keys(require.cache)) delete require.cache[key];
  disableServerlessStatsRequests(serverlessPath);
  for (const [key, value] of entries(modulesCacheStub)) require.cache[key] = { exports: value };

  const restore = () => {
    for (const key of Object.keys(require.cache)) delete require.cache[key];
    Object.assign(require.cache, originalCache);
  };
  try {
    return callback(require(serverlessPath)).then(
      result => {
        restore();
        return result;
      },
      error => {
        restore();
        throw error;
      }
    );
  } catch (error) {
    restore();
    throw error;
  }
};

module.exports = (
  serverlessPath,
  { cwd, cliArgs, env, pluginPathsWhitelist, hookNamesWhitelist, modulesCacheStub }
) =>
  overrideEnv(originalEnv => {
    process.env.APPDATA = originalEnv.APPDATA; // Needed on Windows
    if (env) Object.assign(process.env, env);
    return overrideCwd(cwd, () =>
      overrideArgv({ args: ['serverless', ...(cliArgs || [])] }, () =>
        resolveServerless(serverlessPath, modulesCacheStub, Serverless => {
          // Intialize serverless instances in preconfigured environment
          const serverless = new Serverless();
          const { pluginManager } = serverless;
          const pluginConstructorsWhitelist = pluginPathsWhitelist.map(pluginPath =>
            require(pluginPath)
          );
          return serverless.init().then(() => {
            // Strip registered hooks, so only those intended are executed
            const whitelistedPlugins = pluginManager.plugins.filter(plugin =>
              pluginConstructorsWhitelist.some(Plugin => plugin instanceof Plugin)
            );

            const { hooks } = pluginManager;
            for (const hookName of Object.keys(hooks)) {
              if (!hookNamesWhitelist.includes(hookName)) {
                delete hooks[hookName];
                continue;
              }
              hooks[hookName] = hooks[hookName].filter(({ hook }) =>
                whitelistedPlugins.some(whitelistedPlugin =>
                  values(whitelistedPlugin.hooks).includes(hook)
                )
              );
            }

            // Run plugin manager hooks
            return serverless.run();
          });
        })
      )
    );
  });
