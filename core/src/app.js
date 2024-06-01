const express = require('express');
const { sequelize } = require('./models');
const { swaggerUi, specs } = require('./config/swagger');

const pokemonRoutes = require('./routes/pokemon');
const timeRoutes = require('./routes/times');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

app.use('/api/pokemon', pokemonRoutes);
app.use('/api/times', timeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
