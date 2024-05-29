const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        connectTimeout: 60000
    }
});

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

// Sincroniza o modelo com o banco de dados
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        await sequelize.sync();
        console.log('Modelo sincronizado com o banco de dados.');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
})();

const baseUrl = 'https://pokeapi.co/api/v2/pokemon';
const limit = 20; 

async function PokemonList(offset, limit) {
    const url = `${baseUrl}?offset=${offset}&limit=${limit}`;
    const response = await axios.get(url);
    return response.data.results;
}

async function PokemonDetails(url) {
    const response = await axios.get(url);
    const pokemonData = response.data;

    return {
        id: pokemonData.id,
        name: pokemonData.name,
        types: pokemonData.types.map(type => type.type.name)
    };
}

async function getAllPokemonInfo() {
    let offset = 0;
    let hasNextPage = true;

    while (hasNextPage) {
        try {
            const pokemonList = await PokemonList(offset, limit);
            if (pokemonList.length > 0) {
                for (const pokemon of pokemonList) {
                    const details = await PokemonDetails(pokemon.url);

                    // Upsert -> se existe -> atualiza se não -> cria
                    await DefinicaoPokemon.upsert({
                        id: details.id,
                        nome: details.name,
                        tipo1: details.types[0] ?? null,
                        tipo2: details.types[1] ?? null
                    }).catch(console.log);
                }
                offset += limit; // Atualiza o offset para a próxima página
            } else {
                hasNextPage = false; // Nenhum Pokémon restante para buscar
            }
        } catch (error) {
            console.error('Erro ao buscar dados dos Pokémon:', error);
            hasNextPage = false; // Para o loop em caso de erro
        }
    }
}

getAllPokemonInfo();
