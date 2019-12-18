const articleRouter = require("express").Router();
const {
  send405Error,
  getArticle,
  patchArticle,
  postComment,
  getComments
} = require("../controllers/controllers");

articleRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(send405Error);

articleRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(send405Error);

module.exports = { articleRouter };
