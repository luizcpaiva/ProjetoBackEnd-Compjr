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

Time.Pokemon1 = Time.belongsTo(Pokemon, { as: 'Pokemon1' });
Time.Pokemon2 = Time.belongsTo(Pokemon, { as: 'Pokemon2' });
Time.Pokemon3 = Time.belongsTo(Pokemon, { as: 'Pokemon3' });
Time.Pokemon4 = Time.belongsTo(Pokemon, { as: 'Pokemon4' });
Time.Pokemon5 = Time.belongsTo(Pokemon, { as: 'Pokemon5' });
Time.Pokemon6 = Time.belongsTo(Pokemon, { as: 'Pokemon6' });

//Time.belongsToMany(Pokemon, { through: 'TimePokemon', as: 'pokemons' });

module.exports = Time;
