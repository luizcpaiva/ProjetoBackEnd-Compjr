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

    await DefinicaoPokemon.bulkCreate([
        { nome: 'raikou', tipo1: 'Electric', tipo2: null },
    ]);

    await Moves.bulkCreate([
        { nome: 'pound', precisao: 100, pp: 35, prioridade: 0, poder: 40 },
        { nome: 'cut', precisao: 95, pp: 30, prioridade: 0, poder: 50 },
        { nome: 'thunder', precisao: 70, pp: 10, prioridade: 0, poder: 110 },
    ]);
});

afterAll(async () => {
    await sequelize.close();
});

describe('Pokemon API', () => {
    it('should create a new Pokemon', async () => {
        const response = await request(app)
            .post('/api/pokemon')
            .send({
                "pokemon": "raikou",
                "sexo": "M",
                "shiny": false,
                "altura": 0.4,
                "apelido": "Xumbreguinha",
                "nivel": 5,
                "moves": ["pound", "cut"]
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
            .send({
                apelido: 'Carlos',
                moves: ["thunder", "pound", "cut"]
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('apelido', 'Carlos');
    });

    it('should delete a Pokemon by ID', async () => {
        const response = await request(app).delete('/api/pokemon/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Pokémon excluído com sucesso.');
    });
});