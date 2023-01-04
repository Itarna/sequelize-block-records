const {
  ValidationError,
} = require('sequelize/lib/errors');

module.exports = (sequelize) => {
  if (!sequelize) {
    throw new Error('The required sequelize instance option is missing');
  }
  sequelize.addHook('beforeValidate', (instance, options) => {
    if (!options.validate) return;

    if (instance.isNewRecord) return;

    const changedKeys = [];

    const instance_changed = Array.from(instance._changed);

    instance_changed.forEach((value) => changedKeys.push(value));

    if (!changedKeys.length) return;

    // retrive the model definition
    const modelDefinition = sequelize.models[instance.constructor.name];
    // check if the model has the blockRecords option
    if (modelDefinition.options.blockRecords === true) {
      // if the blockRecords option is true, check the blockField field
      const blockField = modelDefinition.options.blockField || 'isBlocked';
      // if the blockField is not defined or is not BOOLEAN, throw an error
      const blockFieldDefinition = instance.rawAttributes[blockField];
      if (!blockFieldDefinition || blockFieldDefinition.type.key !== 'BOOLEAN') {
        throw new ValidationError(
          `The blockField ${blockField} is not defined or is not BOOLEAN for the model ${modelDefinition.name}`
        );
      }
      // if the blockField is defined and is BOOLEAN, check if the record is blocked using the blockField old value
      if (instance._previousDataValues[blockField] === true) {
        // if the record is blocked, throw an error
        throw new ValidationError(
          `The record is blocked and cannot be updated.`
        );
      }
    }
  });
};
