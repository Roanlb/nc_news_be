const knexion = require("../../connection");

function fetchAllTopics() {
  console.log("model");
  return knexion.select("*").from("topics");
}

module.exports = { fetchAllTopics };
