const { sequelize } = require('../models');
const Sequelize = require('sequelize');
const Board = require('../models/Board');
module.exports = async (bType) => {
  try {
    return await sequelize.query(
      `
      SELECT * FROM (
      SELECT
      ROW_NUMBER() OVER(ORDER BY id DESC, createdAt DESC) AS number,
      ROW_NUMBER() OVER(ORDER BY id ASC, createdAt ASC) AS num,
      id, btype, user_id, title, createdAt
      from boards
      WHERE  btype= ? 
      AND destroyedAt IS NULL
      ) BRD
      WHERE BRD.number BETWEEN 1 AND 15
      ORDER BY id DESC, createdAt DESC;
      `,
      {
        raw: true,
        type: Sequelize.QueryTypes.SELECT,
        replacements: [bType],
      }
    );
  } catch (error) {
    return error;
  }
};
