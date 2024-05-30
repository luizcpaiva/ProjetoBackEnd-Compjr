const express = require('express');
const { sequelize } = require('./models');

const app = express();
app.use(express.json());

const pokemonRoutes = require('./routes/pokemon');
const timeRoutes = require('./routes/times');
const authRoutes = require('./routes/auth');

app.use('/api/pokemon', pokemonRoutes);
app.use('/api/times', timeRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Conectado ao banco de dados.');

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
})();
