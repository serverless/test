'use strict';

const sinon = require('sinon');

module.exports = (inquirer, config) =>
  sinon.stub(inquirer, 'prompt').callsFake(promptConfig => {
    return new Promise(resolve => {
      const configType = promptConfig.type || 'input';
      const questions = config[configType];
      if (!questions) throw new Error(`Unexpected config type: ${configType}`);
      const answer = questions[promptConfig.name];
      if (answer == null) throw new Error(`Unexpected config name: ${promptConfig.name}`);
      resolve(
        new Promise(resolveValidation => {
          if (promptConfig.type !== 'input') return resolveValidation(true);
          if (!promptConfig.validate) return resolveValidation(true);
          return resolveValidation(promptConfig.validate(answer));
        }).then(validationResult => {
          if (validationResult !== true) {
            throw Object.assign(new Error(validationResult), { code: 'INVALID_ANSWER' });
          }
          return { [promptConfig.name]: answer };
        })
      );
    });
  });
