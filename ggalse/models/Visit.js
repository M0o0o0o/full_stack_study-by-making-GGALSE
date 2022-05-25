const Sequelize = require('sequelize');

module.exports = class Visit extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        date: {
          type: Sequelize.STRING(15),
        },
        count: {
          type: Sequelize.INTEGER,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        deletedAt: 'destroyedAt',
        tableName: 'visit',
        modelName: 'Visit',
        underscored: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
};
