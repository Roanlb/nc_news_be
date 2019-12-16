const fetchAllTopics = require("../models/models");

console.log(fetchAllTopics);

function getAllTopics(req, res, next) {
  fetchAllTopics()
    .then(topics => {
      console.log("in topics controller");
      res.status(200).send({ topics: topics });
    })
    .catch(next);
}

module.exports = { getAllTopics };

//console log of fetchalltopics shows up but doesnt activate and show in topics controller
