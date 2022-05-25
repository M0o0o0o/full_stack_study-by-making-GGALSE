const { sequelize } = require('./');

module.exports = () => {
  sequelize
    .sync({
      force: false,
    })
    .then(() => {
      console.log('DB CONNECT');
    })
    .catch((err) => {
      console.error(err);
    });
};
