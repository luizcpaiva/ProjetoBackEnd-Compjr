const sequelize = require('../config/database');
const Moves = require('./moves');
const Pokemon = require('./pokemon');
const Time = require('./times');
const DefinicaoPokemon = require('./definicaoPokemon'); 

module.exports = {
    sequelize,
    Moves,
    Pokemon,
    Time,
    DefinicaoPokemon
};