CREATE SCHEMA IF NOT EXISTS pokemon_schema [ AUTHORIZATION role_specification ]

CREATE TABLE IF NOT EXISTS pokemon_schema.definicaoPokemon (
    ID SERIAL PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Tipo1 VARCHAR(255) NOT NULL,
    Tipo2 VARCHAR(255) 
);
