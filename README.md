# Pokemon manager api

Esta aplicação foi desenvolvida como avaliação para a Empresa Jr da Universidade Federal de Lavras Comp Jr.

O objetivo dessa aplicação é ser um gerenciador de times pokemon básico onde Pokemons podem ser cadastrados e organizados em times.

## Setting up

Para executar essa aplicação a única dependência instalada necessária é Docker Engine e Docker Compose.

As variáveis de ambiente necessárias são:

|Variável | Descrição | Necessária | Valor inicial|
|---------|-----------|------------|--------------|
|POSTGRES_USER|Usuário do banco de dados|Sim|  |
|POSTGRES_PASSWORD|Senha do usuário do banco de dados|Sim|  |
|POSTGRES_DB|Nome do banco de dados|Sim|  |
|POSTGRES_HOST|Host onde o banco de dados está sendo executado. O valor `localhost` é definido caso esteja executando localmente e `database` caso esteja usando docker compose|Não|localhost ou database|
|EMAIL_USER|Credencial utilizada para envio de emails de redefinição de senha|Sim| |
|EMAIL_PASS|Credencial utilizada para envio de emails de redefinição de senha|Sim| |

Você pode usar o arquivo `env-dist` como exemplo.

## Executando pela primeira vez

Ao executar a aplicação pela primeira vez, é necessário executar o `Crawler`, sub-serviço responsável por sincronizar as informações básicas da PokeApi com o banco de dados local. Isso deve ser feito regularmente de modo a manter as informações de `DefinicaoPokemon` e `Moves` sempre atualizados.

Para isso execute o comando a seguir:

```sudo docker compose up crawler```

Esse comando irá levantar o banco de dados, aplicar as migrações necessárias. Ele também irá criar um diretório chamado `pgdata` no diretório `local` desse repositório, onde os dados do banco de dados serão persistidos quando toda a aplicação encerrar. Crawler irá percorrer todas as páginas de pokemon e moves da API e armazenar as informações básicas necessárias.

Para subir a API, utilize o comando:

```sudo docker compose up core```

Caso o banco de dados não esteja disponível, este comando irá levantar o banco de dados e aplicar as migrações necessárias. Além disso, e mais importante, irá subir a API principal do sistema.

Para utilizar os testes automatizados, utilize o comando:

```npm test```

Esse comando irá realizar todos os testes predefinidos do código. Vale atentar que executar os testes irá apagar todos os demais dados do banco de dados.

## Postgres

A escolha do Postgres foi feita pensando na estrutura dos dados. Como já era possível saber de antemão todos os atributos desejados, foi escolhida a abordagem relacional. Com isso é possível ganhar escala e otimizar em tempo. Mas tendo em vista que essa aplicação não será disponibilizada a público, essas otimizações prematuras não seriam necessárias.