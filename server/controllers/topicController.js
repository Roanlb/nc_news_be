const { fetchAllTopics } = require("../models/topicModels");

function getAllTopics(req, res, next) {
  console.log("controller");
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

module.exports = { getAllTopics };
