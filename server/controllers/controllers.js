const fetchAllTopics = require("../models/models");

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

module.exports = { getAllTopics, send405Error };

//console log of fetchalltopics shows up but doesnt activate and show in topics controller
