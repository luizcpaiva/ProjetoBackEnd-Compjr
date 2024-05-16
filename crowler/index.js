const axios = require('axios');

const offset = 0;
const limit = 20;

const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

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

async function getPokemonInfo() {
    try {
        const pokemonList = await PokemonList(offset, limit);

        for (const pokemon of pokemonList) {
            const details = await PokemonDetails(pokemon.url);
            console.log(`ID: ${details.id}`);
            console.log(`Name: ${details.name}`);
            console.log(`Type(s): ${details.types.join(', ')}`);
        }
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

getPokemonInfo();

