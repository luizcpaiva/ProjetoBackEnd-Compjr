const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Pokemon',
            version: '1.0.0',
            description: 'API para gerenciamento de Pokemons e Times',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],
    },
    apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};
