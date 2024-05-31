// tests/time.test.js
const request = require('supertest');
const express = require('express');
const { sequelize, Pokemon, Time, DefinicaoPokemon, Moves } = require('../src/models');
const timeRoutes = require('../src/routes/times');

const app = express();
app.use(express.json());
app.use('/api/times', timeRoutes);

beforeAll(async () => {
    await sequelize.sync({ force: true });

    await DefinicaoPokemon.bulkCreate([
        { nome: 'gengar', tipo1: 'Ghost', tipo2: 'Poison' },
        { nome: 'blastoise', tipo1: 'Water', tipo2: null },
        { nome: 'eevee', tipo1: 'Normal', tipo2: null },
    ]);

    await Moves.bulkCreate([
        { nome: 'shadow-ball', precisao: 100, pp: 15, prioridade: 0, poder: 80 },
        { nome: 'water-pulse', precisao: 100, pp: 20, prioridade: 0, poder: 60 },
        { nome: 'cut', precisao: 95, pp: 30, prioridade: 0, poder: 50 },
    ]);

    await Pokemon.bulkCreate([
        { DefinicaoPokemonId: 1, sexo: 'M', shiny: false, altura: 1.4, apelido: 'Diddy', ivs: 80, evs: 60, nivel: 70 },
        { DefinicaoPokemonId: 2, sexo: 'F', shiny: true, altura: 1.2, apelido: 'Batoré', ivs: 100, evs: 90, nivel: 75 },
        { DefinicaoPokemonId: 3, sexo: 'F', shiny: false, altura: 0.3, apelido: 'Gigi', ivs: 30, evs: 20, nivel: 10 },
    ]);

    const pokemon = await Pokemon.findAll();
    const moveShadowBall = await Moves.findOne({ where: { nome: 'shadow-ball' } });
    const moveCut = await Moves.findOne({ where: { nome: 'cut' } });

    await pokemon[0].addMoves([moveShadowBall, moveCut]);
    const moveWaterPulse = await Moves.findOne({ where: { nome: 'water-pulse' } });
    await pokemon[1].addMoves([moveWaterPulse, moveCut]);
    await pokemon[2].addMoves([moveCut]);
});

afterAll(async () => {
    await sequelize.close();
});

describe('Time API', () => {
    it('should create a new Time', async () => {
        const response = await request(app)
            .post('/api/times')
            .send({
                nomeDoTime: 'Team Rocket',
                pokemonList: [1, 2]
            });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('should get all Times', async () => {
        const response = await request(app).get('/api/times');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get a Time by ID', async () => {
        const response = await request(app).get('/api/times/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });

    it('should update a Time by ID', async () => {
        const response = await request(app)
            .patch('/api/times/1')
            .send({
                nomeDoTime: 'Elite Four',
                pokemon: [1, 3]
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('nomeDoTime', 'Elite Four');
    });

    it('should delete a Time by ID', async () => {
        const response = await request(app).delete('/api/times/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Time excluído com sucesso.');
    });
});