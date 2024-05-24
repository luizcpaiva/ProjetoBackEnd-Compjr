const express = require('express');
const router = express.Router();
const { Time, Pokemon } = require('../models');

router.get('/', async (req, res) => {
    try {
        const times = await Time.findAll();
        res.json(times);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao buscar os times.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nomeDoTime, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon6 } = req.body;

        const pokemonIds = [pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon6].filter(id => id !== undefined && id !== null);

        const pokemons = await Pokemon.findAll({ 
            where: { id: pokemonIds },
            include: [Pokemon.DefinicaoPokemon, Pokemon.Moves]
        });

        if (pokemons.length !== pokemonIds.length) {
            res.status(404).json({ error: 'Um ou mais Pokémon fornecidos não foram encontrados.' });
            return;
        }


        const newTime = await Time.create({ nomeDoTime });

  
        const associations = [
            { method: 'setPokemon1', pokemon: pokemon1 },
            { method: 'setPokemon2', pokemon: pokemon2 },
            { method: 'setPokemon3', pokemon: pokemon3 },
            { method: 'setPokemon4', pokemon: pokemon4 },
            { method: 'setPokemon5', pokemon: pokemon5 },
            { method: 'setPokemon6', pokemon: pokemon6 }
        ];

        for (const association of associations) {
            if (association.pokemon) {
                const pokemon = pokemons.find(p => p.id === association.pokemon);
                await newTime[association.method](pokemon);
            }
        }

        const createdTime = await Time.findByPk(newTime.id, {
            include: [
                { model: Pokemon, as: 'Pokemon1', include: [Pokemon.DefinicaoPokemon] },
                { model: Pokemon, as: 'Pokemon2', include: [Pokemon.DefinicaoPokemon] },
                { model: Pokemon, as: 'Pokemon3', include: [Pokemon.DefinicaoPokemon] },
                { model: Pokemon, as: 'Pokemon4', include: [Pokemon.DefinicaoPokemon] },
                { model: Pokemon, as: 'Pokemon5', include: [Pokemon.DefinicaoPokemon] },
                { model: Pokemon, as: 'Pokemon6', include: [Pokemon.DefinicaoPokemon] }
            ]
        });

        res.status(201).json(createdTime);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Erro ao criar o time.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const time = await Time.findByPk(req.params.id);
        if (time) {
            res.json(time);
        } else {
            res.status(404).json({ error: 'Time não encontrado.' });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao buscar o time.' });
    }
});

router.get('/:id/pokemon', async (req, res) => {
    try {
        const time = await Time.findByPk(req.params.id);
        if (time) {
            const pokemons = await Pokemon.findAll({
                where: {
                    id: [time.pokemon1, time.pokemon2, time.pokemon3, time.pokemon4, time.pokemon5, time.pokemon6]
                }
            });
            res.json(pokemons);
        } else {
            res.status(404).json({ error: 'Time não encontrado.' });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao buscar os Pokémons do time.' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const time = await Time.findByPk(req.params.id);
        if (time) {
            await time.update(req.body);
            res.json(time);
        } else {
            res.status(404).json({ error: 'Time não encontrado.' });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao atualizar o time.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const time = await Time.findByPk(req.params.id);
        if (time) {
            await time.destroy();
            res.json({ message: 'Time excluído com sucesso.' });
        } else {
            res.status(404).json({ error: 'Time não encontrado.' });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao excluir o time.' });
    }
});

module.exports = router;
