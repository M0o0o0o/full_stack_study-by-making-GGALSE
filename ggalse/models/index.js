const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./User');
const Board = require('./Board');
const Visit = require('./Visit');

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Board = Board;

User.init(sequelize);
Board.init(sequelize);
Visit.init(sequelize);

User.associate(db);
Board.associate(db);

module.exports = db;

