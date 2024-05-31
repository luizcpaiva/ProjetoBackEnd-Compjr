const express = require('express');
const router = express.Router();
const { Pokemon, DefinicaoPokemon, Moves, PokemonMoves } = require('../models');

router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.findAll({include: [DefinicaoPokemon, Moves]});
        res.json(pokemons);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao buscar os Pokémons.'});
    }
});

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