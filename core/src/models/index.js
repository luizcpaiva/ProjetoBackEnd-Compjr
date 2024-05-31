const Moves = require('./moves');
const Pokemon = require('./pokemon');
const Time = require('./times');
const DefinicaoPokemon = require('./definicaoPokemon');
const sequelize = require("../config/database")

module.exports = {
    sequelize,
    Moves,
    Pokemon,
    Time,
    DefinicaoPokemon
};

Pokemon.Moves = Pokemon.belongsToMany(Moves, { through: 'PokemonMoves'});
Moves.Pokemon = Moves.belongsToMany(Pokemon, { through: 'PokemonMoves' });