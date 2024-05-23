const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DefinicaoPokemon = sequelize.define('DefinicaoPokemon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo2: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    schema: 'pokemon_schema',
    tableName: 'definicaoPokemon',
    timestamps: false
});

module.exports = DefinicaoPokemon;
