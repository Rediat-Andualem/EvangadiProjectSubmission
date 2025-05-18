require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging:false,
    pool: {
      max: 5, 
      min: 0, 
      acquire: 30000, 
      idle: 10000, 
    }
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_TEST,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    pool: {
      max: 5, 
      min: 0, 
      acquire: 30000, 
      idle: 10000, 
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    pool: {
      max: 10, 
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
  },
};


