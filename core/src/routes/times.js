const express = require('express');
const router = express.Router();
const { Time, Pokemon, TimePokemon } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Times
 *   description: API para gerenciar Times de Pokemons
 */

/**
 * @swagger
 * /api/times:
 *   get:
 *     summary: Recupera a lista de Times
 *     tags: [Times]
 *     responses:
 *       200:
 *         description: A lista de Times
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/times.js'
 */
router.get('/', async (req, res) => {
    try {
        const times = await Time.findAll({include: [Pokemon]});

        res.json(times);       
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao buscar os times.' });
    }
});

/**
 * @swagger
 * /api/times:
 *   post:
 *     summary: Cria um novo Time
 *     tags: [Times]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               pokemons:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: O Time criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/times.js'
 */
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


/**
 * @swagger
 * /api/times/{id}:
 *   get:
 *     summary: Recupera um Time pelo ID
 *     tags: [Times]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do Time
 *     responses:
 *       200:
 *         description: O Time encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/times.js'
 *       404:
 *         description: Time não encontrado
 */
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

/**
 * @swagger
 * /api/times/{id}:
 *   patch:
 *     summary: Atualiza um Time pelo ID
 *     tags: [Times]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do Time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               pokemons:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: O Time atualizado
 *         content:
 *           application/json:
 *             schema:
 *              $ref: './models/times.js'
 *       404:
 *         description: Time não encontrado
 */
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

/**
 * @swagger
 * /api/times/{id}:
 *   delete:
 *     summary: Exclui um Time pelo ID
 *     tags: [Times]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do Time
 *     responses:
 *       204:
 *         description: Time excluído com sucesso
 *       404:
 *         description: Time não encontrado
 */
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
