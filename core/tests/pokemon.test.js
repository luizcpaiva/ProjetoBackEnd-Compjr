// tests/pokemon.test.js

const request = require('supertest');
const express = require('express');
const { sequelize, Pokemon, DefinicaoPokemon, Moves } = require('../src/models');
const pokemonRoutes = require('../src/routes/pokemon');

const app = express();
app.use(express.json());
app.use('/api/pokemon', pokemonRoutes);

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await DefinicaoPokemon.create({ nome: 'Pikachu', tipo1: 'Electric' });
    await Moves.create({ move1: 'Thunderbolt' });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Pokemon API', () => {
    it('should create a new Pokemon', async () => {
        const response = await request(app)
            .post('/api/pokemon')
            .send({
                pokemon: 'Pikachu',
                sexo: 'M',
                shiny: false,
                altura: 0.4,
                ivs: [31, 31, 31, 31, 31, 31],
                evs: [85, 85, 85, 85, 85, 85],
                apelido: 'Sparky',
                nivel: 5
            });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('should get all Pokemons', async () => {
        const response = await request(app).get('/api/pokemon');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get a Pokemon by ID', async () => {
        const response = await request(app).get('/api/pokemon/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });

    it('should update a Pokemon by ID', async () => {
        const response = await request(app)
            .patch('/api/pokemon/1')
            .send({ apelido: 'Thunder' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('apelido', 'Thunder');
    });

    it('should delete a Pokemon by ID', async () => {
        const response = await request(app).delete('/api/pokemon/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Pokémon excluído com sucesso.');
    });
});
