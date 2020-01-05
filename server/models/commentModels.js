const knexion = require("../../connection");

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

function amendComment(comment_id, inc_votes) {
  return knexion("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes || 0)
    .returning("*");
}

function obliterateComment(comment_id) {
  return knexion("comments")
    .where("comment_id", "=", comment_id)
    .del();
}

module.exports = { checkParentCommentExists, amendComment, obliterateComment };
