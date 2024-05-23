const express = require('express');
const router = express.Router();
const { Pokemon, DefinicaoPokemon, Moves } = require('../models');

router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.findAll();
        res.json(pokemons);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os Pokémons.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newPokemon = await Pokemon.create(req.body);
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o Pokémon.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findByPk(req.params.id);
        if (pokemon) {
            res.json(pokemon);
        } else {
            res.status(404).json({ error: 'Pokémon não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o Pokémon.' });
    }
});

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
        res.status(500).json({ error: 'Erro ao atualizar o Pokémon.' });
    }
});

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
        res.status(500).json({ error: 'Erro ao excluir o Pokémon.' });
    }
});

module.exports = router;
