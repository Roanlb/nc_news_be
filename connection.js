const knex = require("knex");
const dbConfig = require("./knexfile");
const knexion = knex(dbConfig);

module.exports = knexion;
