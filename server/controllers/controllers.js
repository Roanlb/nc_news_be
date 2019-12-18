const {
  fetchAllTopics,
  fetchUser,
  fetchArticle,
  amendArticle,
  prepostComment,
  checkParentArticleExists,
  fetchComments
} = require("../models/models");

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

function patchArticle(req, res, next) {
  const article_id = req.params.article_id;
  const body = req.body;
  Promise.all([
    checkParentArticleExists(article_id),
    amendArticle(article_id, body)
  ])
    .then(responseThings => {
      console.log(responseThings, "made it to patch error handler");
      res.status(200).send({ article: responseThings[1] });
    })
    .catch(next);
}

function postComment(req, res, next) {
  const article_id = req.params.article_id;
  const comment = req.body;
  prepostComment(article_id, comment)
    .then(response => {
      res.status(201).send({ comment: response });
    })
    .catch(next);
}

function getComments(req, res, next) {
  const article_id = req.params.article_id;
  console.log(req.query);
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const author = req.query.author;
  const topic = req.query.topic;
  fetchComments(article_id, sort_by, order, author, topic)
    .then(response => {
      console.log(response, "response in controller");
      res.status(200).send({ comments: response });
    })
    .catch(next);
}

module.exports = {
  getAllTopics,
  send405Error,
  getUser,
  getArticle,
  patchArticle,
  postComment,
  getComments
};
