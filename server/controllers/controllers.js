const { fetchAllTopics, fetchUser, fetchArticle } = require("../models/models");

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

function getArticle(req, res, next) {
  console.log(req.params, "req params");
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(response => {
      res.status(200).send({ article: response });
    })
    .catch(next);
}

module.exports = { getAllTopics, send405Error, getUser, getArticle };
