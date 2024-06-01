const express = require('express');
const router = express.Router();
const { Pokemon, DefinicaoPokemon, Moves, PokemonMoves } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Pokemon
 *   description: API para gerenciar Pokemons
 */

/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Recupera a lista de Pokemons
 *     tags: [Pokemon]
 *     responses:
 *       200:
 *         description: A lista de Pokemons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/pokemon.js'
 */
router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.findAll({include: [DefinicaoPokemon, Moves]});
        res.json(pokemons);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao buscar os Pokémons.'});
    }
});

/**
 * @swagger
 * /api/pokemon:
 *   post:
 *     summary: Cria um novo Pokemon
 *     tags: [Pokemon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pokemon:
 *                 type: string
 *               moves:
 *                 type: array
 *                 items:
 *                   type: string
 *               sexo:
 *                 type: string
 *               shiny:
 *                 type: boolean
 *               altura:
 *                 type: number
 *               ivs:
 *                 type: integer
 *               evs:
 *                 type: integer
 *               apelido:
 *                 type: string
 *               nivel:
 *                 type: integer
 *     responses:
 *       201:
 *         description: O Pokemon criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/pokemon.js'
 */
router.post('/', async (req, res) => {
    try {
        const {
            pokemon,
            moves,
            ...pokemonData
        } = req.body

        const requestedMoves = moves ?? [];

        if (requestedMoves.length > 4) {
            return res.status(400).json({ error: "Pokemon pode ter apenas quatro moves" });
        }

        const movesList = await Promise.all(
            requestedMoves.map(id => Moves.findOne({ where: { nome: id }}))
        );

        const pokemon_definition = await DefinicaoPokemon.findOne({ where: { nome: pokemon } })
        if (!pokemon_definition) {
            res.status(404).json({ error: `Erro ao criar pokemon. ${pokemon} não é um pokemon válido`})
            return 
        }
        const newPokemonData = {
            DefinicaoPokemonId: pokemon_definition.id, 
            ...pokemonData
        }

        const newPokemon = await Pokemon.create(newPokemonData);
        movesList.forEach(async move => await newPokemon.addMoves(move, { through: { selfGranted: false } }))

        const showModel = {
            ...newPokemon.dataValues,
            "DefinicaoPokemon": pokemon_definition.dataValues,
            "Moves": movesList.dataValues
        }

        res.status(201).json(showModel);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ "error": `Erro ao criar o Pokémon. ${error}`});
    }
});


/**
 * @swagger
 * /api/pokemon/{id}:
 *   get:
 *     summary: Recupera um Pokemon pelo ID
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do Pokemon
 *     responses:
 *       200:
 *         description: O Pokemon encontrado
 *         content:
 *           application/json:
 *             schema:
 *              $ref: './models/pokemon.js'
 *       404:
 *         description: Pokemon não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findByPk(req.params.id, {include: DefinicaoPokemon, Moves});
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

/**
 * @swagger
 * /api/pokemon/{id}:
 *   patch:
 *     summary: Atualiza um Pokemon pelo ID
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do Pokemon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               evs:
 *                 type: integer
 *               apelido:
 *                 type: string
 *               nivel:
 *                 type: integer
 *               altura:
 *                 type: number
 *               moves:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: O Pokemon atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/pokemon.js'
 *       404:
 *         description: Pokemon não encontrado
 */
router.patch('/:id', async (req, res) => {
    try {
        const {
            evs,
            apelido,
            nivel,
            altura,
            moves
        } = req.body

        const pokemon = await Pokemon.findByPk(req.params.id);
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon não encontrado.' });
        }

        if(moves) {
            await PokemonMoves.destroy({where: {
                "PokemonId": pokemon.id
            }})
            const movesList = await Promise.all(
                moves.map(move => Moves.findOne({ where: { nome:move }}))
            )
    
            movesList.forEach(async move => await pokemon.addMoves(move, { through: { selfGranted: false } }))
        }

        const updatedFields = {evs,apelido,nivel,altura}
        await pokemon.update(updatedFields);

        const updated = await Pokemon.findByPk(req.params.id, {include: [DefinicaoPokemon, Moves]});

        res.json(updated);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao atualizar o Pokémon.'});
    }
});

/**
 * @swagger
 * /api/pokemon/{id}:
 *   delete:
 *     summary: Exclui um Pokemon pelo ID
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do Pokemon
 *     responses:
 *       204:
 *         description: Pokemon excluído com sucesso
 *       404:
 *         description: Pokemon não encontrado
 */
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