const request = require('supertest');
const express = require('express');
const { sequelize, Pokemon, Time } = require('../models');
const timeRoutes = require('../routes/times');

const app = express();
app.use(express.json());
app.use('/api/times', timeRoutes);

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sincroniza o banco de dados para cada teste
    // Cria alguns Pokémons para serem usados nos testes
    await Pokemon.bulkCreate([
        { sexo: 'M', shiny: false, altura: 1.0, ivs: 31, evs: 100, apelido: 'Charizard', nivel: 36, definicaoID: 1, movesID: 1 },
        { sexo: 'F', shiny: true, altura: 0.8, ivs: 25, evs: 85, apelido: 'Blastoise', nivel: 32, definicaoID: 2, movesID: 2 }
    ]);
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
                pokemon1: 1,
                pokemon2: 2,
                pokemon3: null,
                pokemon4: null,
                pokemon5: null,
                pokemon6: null
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

    it('should get all Pokemons in a Time by Time ID', async () => {
        const response = await request(app).get('/api/times/1/pokemon');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should update a Time by ID', async () => {
        const response = await request(app)
            .patch('/api/times/1')
            .send({ nomeDoTime: 'Elite Four' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('nomeDoTime', 'Elite Four');
    });

    it('should delete a Time by ID', async () => {
        const response = await request(app).delete('/api/times/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Time excluído com sucesso.');
    });
});
