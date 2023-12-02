const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
// const config = require('./config.json')[process.env.NODE_ENV || 'development'];

const config = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.INSTANCE_UNIX_SOCKET,
  dialect: 'mysql',
}

const sequelize = new Sequelize(config);

// const sequelize = new Sequelize(
//   process.env.DB_NAME || config.database,
//   process.env.DB_USER || config.username,
//   process.env.DB_PASSWORD || config.password,
//   {
//     dialect: 'mysql',
//     dialectOptions: {
//       socketPath: "/cloudsql/jude:us-central1:testdbjude"
//     }
//   }
// );

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });

module.exports = sequelize;
