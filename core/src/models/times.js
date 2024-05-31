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
}, {
    schema: 'pokemon_schema',
    tableName: 'time',
    timestamps: false
});

Time.belongsToMany(Pokemon, { through: 'TimePokemon', as: 'pokemons' });

module.exports = Time;
