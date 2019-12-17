const { fetchAllTopics, fetchUser } = require("../models/models");

function getAllTopics(req, res, next) {
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function send405Error(req, res, next) {
  res.status(405).send({ msg: "Method not allowed" });
}

function getUser(req, res, next) {
  const { username } = req.params;
  fetchUser(username)
    .then(response => {
      res.status(200).send({ user: response[0] });
    })
    .catch(next);
}

module.exports = { getAllTopics, send405Error, getUser };
