const {
  fetchArticle,
  amendArticle,
  prepostComment,
  checkParentArticleExists,
  fetchComments,
  fetchArticles,
  checkUserExists,
  checkTopicExists,
  checkColumnExists,
  checkOrder
} = require("../models/articleModels");

function getArticle(req, res, next) {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(([response]) => {
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
      res.status(200).send({ article: responseThings[1][0] });
    })
    .catch(next);
}

function postComment(req, res, next) {
  const article_id = req.params.article_id;
  const comment = req.body;
  prepostComment(article_id, comment)
    .then(response => {
      res.status(201).send({ comment: response[0] });
    })
    .catch(next);
}

function getComments(req, res, next) {
  const article_id = req.params.article_id;
  const sort_by = req.query.sort_by;
  const order = req.query.order;

  if (sort_by) {
    Promise.all([
      checkColumnExists(sort_by),
      checkParentArticleExists(article_id),
      fetchComments(article_id, sort_by, order)
    ])
      .then(responseThings => {
        res.status(200).send({ comments: responseThings[2] });
      })
      .catch(next);
  } else
    Promise.all([
      checkParentArticleExists(article_id),
      fetchComments(article_id, sort_by, order)
    ])
      .then(responseThings => {
        res.status(200).send({ comments: responseThings[1] });
      })
      .catch(next);
}

function getArticles(req, res, next) {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const author = req.query.author;
  const topic = req.query.topic;

  const getArticlesPromises = [fetchArticles(sort_by, order, author, topic)];
  if (author) {
    getArticlesPromises.push(checkUserExists(author));
  }
  if (topic) {
    getArticlesPromises.push(checkTopicExists(topic));
  }
  if (sort_by) {
    getArticlesPromises.push(checkColumnExists(sort_by));
  }
  if (order) {
    getArticlesPromises.push(checkOrder(order));
  }
  Promise.all(getArticlesPromises)
    .then(responseThings => {
      res.status(200).send({ articles: responseThings[0] });
    })
    .catch(next);
}

module.exports = {
  getArticle,
  patchArticle,
  postComment,
  getComments,
  getArticles
};
