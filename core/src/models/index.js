const Moves = require('./moves');
const Pokemon = require('./pokemon');
const Time = require('./times');
const DefinicaoPokemon = require('./definicaoPokemon');
const sequelize = require("../config/database")

const PokemonMoves = sequelize.define("PokemonMoves", {}, {
    tableName: "PokemonMoves",
    schema: "pokemon_schema"
})
Pokemon.Moves = Pokemon.belongsToMany(Moves, { through: PokemonMoves });
Moves.Pokemon = Moves.belongsToMany(Pokemon, { through: PokemonMoves });

const TimePokemon = sequelize.define("TimePokemon", {}, {
    tableName: "TimePokemon",
    schema: "pokemon_schema"
})
Time.Pokemon = Time.belongsToMany(Pokemon, { through: TimePokemon });
Pokemon.Time = Pokemon.belongsToMany(Time, { through: TimePokemon });

module.exports = {
    sequelize,
    Moves,
    Pokemon,
    Time,
    DefinicaoPokemon,
    TimePokemon,
    PokemonMoves
};
