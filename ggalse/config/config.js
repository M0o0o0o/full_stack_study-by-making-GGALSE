require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'ggalse',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    timezone: '+09:00',
  },
  test: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'ggalse',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00',
  },
  production: {
    username: 'dlandif22',
    password: process.env.CAFE24,
    database: 'dlandif22',
    host: 'nodejs-010.cafe24.com',
    port : 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '+09:00',
  },
};
