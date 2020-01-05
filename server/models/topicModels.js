const knexion = require("../../connection");

function fetchAllTopics() {
  return knexion.select("*").from("topics");
}

module.exports = { fetchAllTopics };
