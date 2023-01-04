const { factory } = require('factory-girl');
const { DataTypes, Sequelize } = require('sequelize');
const faker = require('faker');
const sequelizeBlockRecords = require('../lib');

const sequelize = new Sequelize('sqlite::memory:', {
  logging: false, // Disables logging
});

sequelizeBlockRecords(sequelize);

const Model_1 = sequelize.define('Model_1', {
  attr1: DataTypes.STRING,
  attr2: DataTypes.STRING,
});

const Model_2 = sequelize.define('Model_2', {
  attr1: DataTypes.STRING,
  attr2: DataTypes.STRING,
  attr3: DataTypes.STRING,
},{
  blockRecords: true,
});

const Model_3 = sequelize.define('Model_3', {
  attr1: DataTypes.STRING,
  attr2: DataTypes.STRING,
  attr3: DataTypes.BOOLEAN,
},{
  blockRecords: true,
  blockField: 'attr3'
});

factory.define('Model_1', Model_1, {
  attr1: faker.name.findName(),
  attr2: faker.name.findName(),
  attr3: faker.name.findName(),
});
factory.define('Model_2', Model_2, {
  attr1: faker.name.findName(),
  attr2: faker.name.findName(),
  attr3: faker.name.findName(),
});
factory.define('Model_3', Model_3, {
  attr1: faker.name.findName(),
  attr2: faker.name.findName(),
  attr3: faker.name.findName(),
});

describe('if `blockRecords`', () => {
  beforeAll(() => {
    return sequelize.sync({
      force: true,
    });
  });

  describe('was not set', () => {
    it('should allow attributes modifications', async () => {
      const model_1 = await factory.create('Model_1');

      const response = model_1.update(
        { attr1: 'ariel' },
        {
          where: { id: model_1.id },
        }
      );

      await expect(response).resolves.toMatchObject(response);
    });
  });

  describe('was set without blockField', () => {
    it('should throw configuration error', async () => {
      const model_2 = await factory.create('Model_2');

      const response = model_2.update(
        { attr3: 'ariel' },
        {
          where: { id: model_2.id },
        }
      );

      await expect(response).rejects.toThrow(
        'The blockField isBlocked is not defined or is not BOOLEAN for the model'
      );
    });
  });

  describe('was set with blockField', () => {
    it('should allow modifications on records not was blocked', async () => {
      const model_3 = await factory.create('Model_3');

      const response = model_3.update(
        { attr1: 'ariel' },
        {
          where: { id: model_3.id },
        }
      );

      await expect(response).resolves.toMatchObject(response);
    });

    it('should allow modifications on records not was blocked over blockField', async () => {
      const model_3 = await factory.create('Model_3');

      const response = model_3.update(
        { attr1: 'ariel', attr3: true },
        {
          where: { id: model_3.id },
        }
      );

      await expect(response).resolves.toMatchObject(response);
    });

    it('should not allow modifications on records was blocked', async () => {
      const model_3 = await factory.create('Model_3');

      const response1 = model_3.update(
        { attr1: 'ariel', attr3: true },
        {
          where: { id: model_3.id },
        }
      );

      await expect(response1).resolves.toMatchObject(response1);

      const response2 = model_3.update(
        { attr1: 'ariel2' },
        {
          where: { id: model_3.id },
        }
      );

      await expect(response2).rejects.toThrow(
        'The record is blocked and cannot be updated.'
      );
    });
  });
});
