CREATE SCHEMA IF NOT EXISTS pokemon_schema;

CREATE TABLE IF NOT EXISTS pokemon_schema.definicaoPokemon (
    ID SERIAL PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Tipo1 VARCHAR(255) NOT NULL,
    Tipo2 VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS pokemon_schema.Moves (
    ID SERIAL PRIMARY KEY,
    Move1 VARCHAR(255),
    Move2 VARCHAR(255),
    Move3 VARCHAR(255),
    Move4 VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS pokemon_schema.Pokemon (
    ID SERIAL PRIMARY KEY,
    Sexo VARCHAR(255),
    Shiny BOOLEAN,
    Altura FLOAT,
    IVs SMALLINT,
    EVs SMALLINT,
    Apelido VARCHAR(255),
    Nível SMALLINT,
    FOREIGN KEY (Pokemon) REFERENCES pokemon_schema.definicaoPokemon(ID),
    FOREIGN KEY (MovesID) REFERENCES pokemon_schema.Moves(ID)
);

CREATE TABLE IF NOT EXISTS pokemon_schema.Time (
    ID SERIAL PRIMARY KEY,
    NomeDoTime VARCHAR(255),
    FOREIGN KEY (Pokemon1) REFERENCES pokemon_schema.Pokemon(ID),
    FOREIGN KEY (Pokemon2) REFERENCES pokemon_schema.Pokemon(ID),
    FOREIGN KEY (Pokemon3) REFERENCES pokemon_schema.Pokemon(ID),
    FOREIGN KEY (Pokemon4) REFERENCES pokemon_schema.Pokemon(ID),
    FOREIGN KEY (Pokemon5) REFERENCES pokemon_schema.Pokemon(ID),
    FOREIGN KEY (Pokemon6) REFERENCES pokemon_schema.Pokemon(ID)
);