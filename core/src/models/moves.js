const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Moves = sequelize.define('Moves', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precisao: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    pp: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    prioridade: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    poder: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    schema: 'pokemon_schema',
    tableName: 'moves',
    timestamps: false
});

module.exports = Moves;