const axios = require('axios');
const { DefinicaoPokemon } = require("../../../core/src/models")

async function PokemonList(baseUrl, offset, limit) {
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

async function getAllPokemonInfo(baseUrl, limit) {
    let offset = 0;
    let hasNextPage = true;

    while (hasNextPage) {
        try {
            const pokemonList = await PokemonList(baseUrl, offset, limit);
            if (pokemonList.length > 0) {
                for (const pokemon of pokemonList) {
                    const details = await PokemonDetails(pokemon.url);

                    await DefinicaoPokemon.upsert({
                        id: details.id,
                        nome: details.name,
                        tipo1: details.types[0] ?? null,
                        tipo2: details.types[1] ?? null
                    }).catch(console.log);
                }
                offset += limit;
            } else {
                hasNextPage = false;
            }
        } catch (error) {
            console.error('Erro ao buscar dados dos Pokémon:', error);
            hasNextPage = false;
        }
    }
}

async function fetchPokemon() {

    const baseUrl = 'https://pokeapi.co/api/v2/pokemon';
    const limit = 20; 
    
    getAllPokemonInfo(baseUrl, limit);
}

module.exports = fetchPokemon