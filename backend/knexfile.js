const path = require('path');
require('dotenv').config();
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_FILE || path.resolve(__dirname, 'database', 'dev.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, 'database', 'migrations')
    }
  }
};
