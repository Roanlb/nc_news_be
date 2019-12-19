const {
  fetchAllTopics,
  fetchUser,
  fetchArticle,
  amendArticle,
  prepostComment,
  checkParentArticleExists,
  fetchComments,
  fetchArticles,
  amendComment,
  obliterateComment,
  checkParentCommentExists,
  checkUserExists,
  checkTopicExists
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
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  fetchComments(article_id, sort_by, order)
    .then(response => {
      res.status(200).send({ comments: response });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const author = req.query.author;
  const topic = req.query.topic;
  if (author) {
    Promise.all([
      checkUserExists(author),
      fetchArticles(sort_by, order, author, topic)
    ])
      .then(responseThings => {
        res.status(200).send({ articles: responseThings[1] });
      })
      .catch(next);
  } else if (topic) {
    Promise.all([
      checkTopicExists(topic),
      fetchArticles(sort_by, order, author, topic)
    ])
      .then(responseThings => {
        res.status(200).send({ articles: responseThings[1] });
      })
      .catch(next);
  } else
    fetchArticles(sort_by, order, author, topic)
      .then(response => {
        res.status(200).send({ articles: response });
      })
      .catch(next);
}

function patchComment(req, res, next) {
  const comment_id = req.params.comment_id;
  const inc_votes = req.body.inc_votes;
  console.log(comment_id, "comment id in patch comment controller");
  console.log(inc_votes, " inc votes in patch comment controller");
  Promise.all([
    checkParentCommentExists(comment_id),
    amendComment(comment_id, inc_votes)
  ])
    .then(responseThings => {
      res.status(200).send({ comment: responseThings[1] });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const comment_id = req.params.comment_id;
  console.log(comment_id, "comment id in controller");

  Promise.all([
    checkParentCommentExists(comment_id),
    obliterateComment(comment_id)
  ])
    .then(responseThings => {
      res.sendStatus(204);
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
  getComments,
  getArticles,
  patchComment,
  deleteComment
};
