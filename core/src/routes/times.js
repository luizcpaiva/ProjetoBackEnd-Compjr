const express = require('express');
const router = express.Router();
const { Time, Pokemon, TimePokemon } = require('../models');

router.get('/', async (req, res) => {
    try {
        const times = await Time.findAll({include: [Pokemon]});

        res.json(times);       
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao buscar os times.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            nomeDoTime,
            pokemonList
        } = req.body;

        console.log(pokemonList)

        if (pokemonList === undefined || pokemonList.length == 0) {
            return res.status(400).json({error: "Deve fornecer pelo menos um pokemon para o time"})
        }
        if (pokemonList.length > 6) {
            return res.status(400).json({error: "Um time não pode conter mais que seis pokemon"})
        }

        const pokemons = await Promise.all(
            pokemonList.map(id => Pokemon.findOne({ where: { id }}))
        );

        if (pokemons.some(pokemon => !pokemon)) {
            return res.status(404).json({ error: 'Um ou mais pokémons não foram encontrados.' });
        }

        const newTimeData = {
            nomeDoTime,
        };

        const newTime = await Time.create(newTimeData)
        pokemons.forEach(async poke => await newTime.addPokemon(poke, { through: { selfGranted: false } }))
        res.status(201).json(newTime);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Erro ao criar o time.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const time = await Time.findByPk(req.params.id, { include: [Pokemon] });
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

router.patch('/:id', async (req, res) => {
    try {

        const {
            nomeDoTime,
            pokemon
        } = req.body

        const pokemonList = pokemon ?? []

        const updatedFields = {nomeDoTime}

        const time = await Time.findByPk(req.params.id);
        if (!time) {
            res.status(404).json({ error: 'Time não encontrado.' });
        }
        if (pokemon){
            await TimePokemon.destroy({where: {
                "TimeId": time.id
            }})

            const pokemons = await Promise.all(
                pokemonList.map(id => Pokemon.findOne({ where: { id }}))
            );

            pokemons.forEach(async poke => await time.addPokemon(poke, { through: { selfGranted: false } }))
        }
        await time.update(updatedFields);
        res.json(time);

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
