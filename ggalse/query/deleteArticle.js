const { sequelize } = require('../models');
const Sequelize = require('sequelize');

module.exports = async (id) => {
  try {
    await sequelize.query(
      `
      DELETE FROM boards WHERE id = ?;
      `,
      {
        raw: true,
        type: Sequelize.QueryTypes.DELETE,
        replacements: [id],
      }
    );

    return;
  } catch (error) {
    return error;
  }
};
