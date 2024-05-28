const express = require('express');
const router = express.Router();
const { Time, Pokemon } = require('../models');

router.get('/', async (req, res) => {
    try {
        const times = await Time.findAll({include: ["Pokemon1", "Pokemon2", "Pokemon3", "Pokemon4", "Pokemon5", "Pokemon6"]});

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
            Pokemon1Id: pokemons[0]?.id,
            Pokemon2Id: pokemons[1]?.id,
            Pokemon3Id: pokemons[2]?.id,
            Pokemon4Id: pokemons[3]?.id,
            Pokemon5Id: pokemons[4]?.id,
            Pokemon6Id: pokemons[5]?.id
        };

        const newTime = await Time.create(newTimeData);
        res.status(201).json(newTime);
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
