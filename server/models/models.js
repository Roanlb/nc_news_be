const knexion = require("../../db/data/connection");

function fetchAllTopics() {
  return knexion.select("*").from("topics");
}

function fetchUser(username) {
  return knexion
    .select("*")
    .from("users")
    .where("username", username)
    .then(response => {
      if (!response.length) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      } else return response;
    });
}

module.exports = { fetchAllTopics, fetchUser };
