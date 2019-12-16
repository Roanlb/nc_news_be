const knexion = require("../../db/data/connection");

function fetchAllTopics() {
  console.log("in model");
  return knexion
    .select("*")
    .from("topics")
    .returning("*");
}

module.exports = fetchAllTopics;
