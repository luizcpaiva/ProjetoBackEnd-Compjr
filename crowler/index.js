const axios = require('axios');

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
                    console.log(`ID: ${details.id}`);
                    console.log(`Nome: ${details.name}`);
                    console.log(`Tipo(s): ${details.types.join(', ')}`);
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