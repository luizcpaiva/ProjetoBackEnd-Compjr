const sequelize = require('../config/database');
const Moves = require('./moves');
const Pokemon = require('./pokemon');
const Time = require('./times');
const DefinicaoPokemon = require('./definicaoPokemon'); 


DefinicaoPokemon.hasMany(Pokemon, { foreignKey: 'definicaoID' });
Pokemon.belongsTo(DefinicaoPokemon, { foreignKey: 'definicaoID' });

Moves.hasMany(Pokemon, { foreignKey: 'movesID' });
Pokemon.belongsTo(Moves, { foreignKey: 'movesID' });

Time.belongsTo(Pokemon, { as: 'pokemon1Details', foreignKey: 'pokemon1' });
Time.belongsTo(Pokemon, { as: 'pokemon2Details', foreignKey: 'pokemon2' });
Time.belongsTo(Pokemon, { as: 'pokemon3Details', foreignKey: 'pokemon3' });
Time.belongsTo(Pokemon, { as: 'pokemon4Details', foreignKey: 'pokemon4' });
Time.belongsTo(Pokemon, { as: 'pokemon5Details', foreignKey: 'pokemon5' });
Time.belongsTo(Pokemon, { as: 'pokemon6Details', foreignKey: 'pokemon6' });

module.exports = {
    sequelize,
    Moves,
    Pokemon,
    Time,
    DefinicaoPokemon
};