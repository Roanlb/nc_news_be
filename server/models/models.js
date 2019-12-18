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
  return (
    knexion
      //make sure its getting the right comment count
      .select("articles.*")
      .from("articles")
      .where("articles.article_id", article_id)
      .count({ comment_count: "comments.comment_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .then(response => {
        console.log(response, "response in model");
        if (!response.length) {
          return Promise.reject({ status: 404, msg: "Article does not exist" });
        } else return response;
      })
  );
}

module.exports = { fetchAllTopics, fetchUser, fetchArticle };
