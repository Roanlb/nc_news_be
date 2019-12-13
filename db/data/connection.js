const knex = require("knex");
const dbConfig = require("../knexfile");
const knexion = knex(dbConfig);

console.log(knexion);

module.exports = knexion;
