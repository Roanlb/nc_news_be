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

function fetchArticle(article_id) {
  return knexion
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(response => {
      if (!response.length) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      } else return response;
    });
}

function amendArticle(article_id, body) {
  if (!body.hasOwnProperty("inc_votes")) {
    return Promise.reject({ status: 400, msg: "Malformed body" });
  }
  return knexion("articles")
    .where("article_id", "=", article_id)
    .increment("votes", body.inc_votes)
    .returning("*");
}

function prepostComment(article_id, comment) {
  if (!comment.hasOwnProperty("username") || !comment.hasOwnProperty("body")) {
    return Promise.reject({ status: 400, msg: "Malformed body" });
  } else
    return knexion("comments")
      .insert({
        author: comment.username,
        body: comment.body,
        article_id: article_id
      })
      .returning("*");
}

function checkParentArticleExists(id) {
  return knexion("articles")
    .select("*")
    .where("article_id", "=", id)
    .then(existentArticleArray => {
      if (!existentArticleArray.length) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
    });
}

function checkParentCommentExists(id) {
  return knexion("comments")
    .select("*")
    .where("comment_id", "=", id)
    .then(existentCommentArray => {
      if (!existentCommentArray.length) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
    });
}

function fetchComments(article_id, sort_by, order) {
  return knexion("comments")
    .select("*")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc");
}

function fetchArticles(sort_by, order, author, topic) {
  return knexion("articles")
    .select("articles.*")
    .from("articles")
    .orderBy(sort_by || "articles.created_at", order || "desc")
    .count({ comment_count: "comments.comment_id" })
    .modify(query => {
      if (author) query.where("articles.author", "=", author);
    })
    .modify(query => {
      if (topic) query.where("articles.topic", "=", topic);
    })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id");
}

function amendComment(comment_id, inc_votes) {
  return knexion("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*");
}

function obliterateComment(comment_id) {
  return knexion("comments")
    .where("comment_id", "=", comment_id)
    .del();
}

function checkUserExists(username) {
  return knexion("users")
    .select("*")
    .where("username", "=", username)
    .then(existentUserArray => {
      if (!existentUserArray.length) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
    });
}

function checkTopicExists(topic) {
  return knexion("topics")
    .select("*")
    .where("slug", "=", topic)
    .then(existentTopicArray => {
      if (!existentTopicArray.length) {
        return Promise.reject({ status: 404, msg: "Topic does not exist" });
      }
    });
}

module.exports = {
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
};
