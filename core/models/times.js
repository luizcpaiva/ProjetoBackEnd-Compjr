const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pokemon = require('./pokemon');

const Time = sequelize.define('Time', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomeDoTime: DataTypes.STRING,
    pokemon1: {
        type: DataTypes.INTEGER,
        references: {
            model: Pokemon,
            key: 'id'
        }
    },
    pokemon2: {
        type: DataTypes.INTEGER,
        references: {
            model: Pokemon,
            key: 'id'
        }
    },
    pokemon3: {
        type: DataTypes.INTEGER,
        references: {
            model: Pokemon,
            key: 'id'
        }
    },
    pokemon4: {
        type: DataTypes.INTEGER,
        references: {
            model: Pokemon,
            key: 'id'
        }
    },
    pokemon5: {
        type: DataTypes.INTEGER,
        references: {
            model: Pokemon,
            key: 'id'
        }
    },
    pokemon6: {
        type: DataTypes.INTEGER,
        references: {
            model: Pokemon,
            key: 'id'
        }
    }
}, {
    schema: 'pokemon_schema',
    tableName: 'time',
    timestamps: false
});

module.exports = Time;
