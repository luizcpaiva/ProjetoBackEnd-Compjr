const axios = require('axios');
const { Moves } = require("../../../core/src/models")

async function MovesList(baseUrl, offset, limit) {
    const url = `${baseUrl}?offset=${offset}&limit=${limit}`;
    const response = await axios.get(url);
    return response.data.results;
}

async function MovesDetails(url) {
    const response = await axios.get(url);
    const movesData = response.data;

    return {
        id: movesData.id,
        nome: movesData.name,
        precisao: movesData.accuracy,
        pp: movesData.pp,
        prioridade: movesData.priority,
        poder: movesData.power
    };
}

async function getAllMovesInfo(baseUrl, limit) {
    let offset = 0;
    let hasNextPage = true;

    while (hasNextPage) {
        try {
            const moveList = await MovesList(baseUrl, offset, limit);
            if (moveList.length > 0) {
                for (const move of moveList) {
                    const details = await MovesDetails(move.url);

                    await Moves.upsert(details).catch(console.log);
                }
                offset += limit; 
            } else {
                hasNextPage = false; 
            }
        } catch (error) {
            console.error('Erro ao buscar dados dos Moves:', error);
            hasNextPage = false; 
        }
    }
}

async function fetchMoves() {
    
    const baseUrl = 'https://pokeapi.co/api/v2/move';
    const limit = 20; 
    
    
    getAllMovesInfo(baseUrl, limit);
}

module.exports = fetchMoves