const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Moves = sequelize.define('Moves', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    move1: DataTypes.STRING,
    move2: DataTypes.STRING,
    move3: DataTypes.STRING,
    move4: DataTypes.STRING
}, {
    schema: 'pokemon_schema',
    tableName: 'moves',
    timestamps: false
});

module.exports = Moves;
