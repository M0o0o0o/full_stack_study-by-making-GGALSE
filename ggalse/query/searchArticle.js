const { sequelize } = require('../models');
const Sequelize = require('sequelize');
const Board = require('../models/Board');

module.exports = async (board_Id) => {
  try {
    return (
      await sequelize.query(
        `select btype, title, content, view, username, user_id, id, 
        date_format(createdAt, '%y.%m.%d %H:%i') as createdAt from boards
        where id=?;`,
        {
          raw: true,
          type: Sequelize.QueryTypes.SELECT,
          replacements: [board_Id],
        }
      )
    )[0];
  } catch (error) {
    return error;
  }
};
