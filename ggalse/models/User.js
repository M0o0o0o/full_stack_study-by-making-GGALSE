const Sequelize = require('sequelize');

// provider 21-07-20 작성
// 1 : kakao
// 2 : naver
// 3 : google
// 4 : local
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        username: {
          type: Sequelize.STRING(50),
        },
        user_id: {
          type: Sequelize.STRING(50),
        },
        password: {
          type: Sequelize.STRING(100),
        },
        email: {
          type: Sequelize.STRING(50),
        },
        sns_id: {
          type: Sequelize.STRING(255),
        },
        provider: {
          type: Sequelize.STRING(1),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        deletedAt: 'destroyedAt',
        tableName: 'users',
        modelName: 'User',
        underscored: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Board, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'CASCADE' });
  }
};
