const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD, {
        host: process.env.POSTGRES_HOST ?? 'localhost',
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            connectTimeout: 60000
        }
    }
);

module.exports = sequelize;
