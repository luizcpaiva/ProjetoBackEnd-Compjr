const express = require('express');
const router = express.Router();
const { Pokemon, DefinicaoPokemon, Moves } = require('../models');

// Rota para buscar todos os Pokémons
router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.findAll({include: DefinicaoPokemon});
        res.json(pokemons);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao buscar os Pokémons.'});
    }
});

// Rota para criar um novo Pokémon

/**

{
    "apelido?": ...
    "nivel?": ...
    "shiny?": ...
    "sexo?": ...
    "altura?": ...
    "pokemon": ...
}

 */

router.post('/', async (req, res) => {
    try {
        const {
            pokemon,
            ...pokemonData
        } = req.body

        const pokemon_defition = await DefinicaoPokemon.findOne({ where: { nome: pokemon } })
        if (!pokemon_defition) {
            res.status(404).json({ error: `Erro ao criar pokemon. ${pokemon} não é um pokemon válido`})
            return 
        }
        const newPokemonData = {DefinicaoPokemonId: pokemon_defition.id, ...pokemonData }
        console.log(newPokemonData)
        const newPokemon = await Pokemon.create(newPokemonData, {association: Pokemon.DefinicaoPokemon, include: [Pokemon.DefinicaoPokemon]});
        res.status(201).json(newPokemon);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao criar o Pokémon.'});
    }
});

// Rota para buscar um Pokémon por ID
router.get('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findByPk(req.params.id);
        if (pokemon) {
            res.json(pokemon);
        } else {
            res.status(404).json({ error: 'Pokémon não encontrado.' });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao buscar o Pokémon.'});
    }
});

// Rota para atualizar um Pokémon por ID
router.patch('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findByPk(req.params.id);
        if (pokemon) {
            await pokemon.update(req.body);
            res.json(pokemon);
        } else {
            res.status(404).json({ error: 'Pokémon não encontrado.' });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao atualizar o Pokémon.'});
    }
});

// Rota para excluir um Pokémon por ID
router.delete('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findByPk(req.params.id);
        if (pokemon) {
            await pokemon.destroy();
            res.json({ message: 'Pokémon excluído com sucesso.' });
        } else {
            res.status(404).json({ error: 'Pokémon não encontrado.' });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao excluir o Pokémon.'});
    }
});

module.exports = router;
