const fetchPokemon = require("./runners/pokemon")
const fetchMoves = require("./runners/moves")
const sequelize = require("../../core/src/config/database")
require('dotenv').config();

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        await sequelize.sync();
        console.log('Modelo sincronizado com o banco de dados.');

        fetchPokemon()
        fetchMoves()
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
}

main()