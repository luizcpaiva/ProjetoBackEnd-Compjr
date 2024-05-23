const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const DefinicaoPokemon = require('./definicaoPokemon');
const Moves = require('./moves');

const Pokemon = sequelize.define('Pokemon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Pokemon: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DefinicaoPokemon,
            key: 'id'
        }
    },
    sexo: DataTypes.STRING,
    shiny: DataTypes.BOOLEAN,
    altura: DataTypes.FLOAT,
    ivs: DataTypes.SMALLINT,
    evs: DataTypes.SMALLINT,
    apelido: DataTypes.STRING,
    nivel: DataTypes.SMALLINT,
    movesID: {
        type: DataTypes.INTEGER,
        references: {
            model: Moves,
            key: 'id'
        }
    }
}, {
    schema: 'pokemon_schema',
    tableName: 'pokemon',
    timestamps: false
});

module.exports = Pokemon;
