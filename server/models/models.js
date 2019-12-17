const knexion = require("../../db/data/connection");

function fetchAllTopics() {
  return knexion.select("*").from("topics");
}

module.exports = fetchAllTopics;
