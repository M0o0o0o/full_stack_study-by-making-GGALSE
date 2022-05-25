// id : primary key
// type : 게시판 카테고리
// user_id : 작성자
// title

// content : 글 내용
// created
// modified
// deleted
// view 조회수

// btype
/*
깔세자리제공 - 1
깔세자리구함 - 2
노점/푸드트럭 - 3
임대및매매 - 4
깔세상품제공 - 5
깔세상품구매 - 6
자유게시판 - 7
공지사항 - 8
*/

const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        btype: {
          type: Sequelize.STRING(2),
        },
        title: {
          type: Sequelize.STRING,
        },
        content: {
          type: Sequelize.TEXT,
        },
        view: {
          type: Sequelize.INTEGER,
        },
        username: {
          type: Sequelize.STRING(50),
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        deletedAt: 'destroyedAt',
        tableName: 'boards',
        modelName: 'Board',
        underscored: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.Board.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE' });
  }
};
