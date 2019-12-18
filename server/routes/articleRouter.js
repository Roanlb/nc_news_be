const articleRouter = require("express").Router();
const {
  send405Error,
  getArticle,
  patchArticle,
  postArticle
} = require("../controllers/controllers");

articleRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(send405Error);

articleRouter
  .route("/:article_id/comments")
  .post(postArticle)
  .all(send405Error);

module.exports = { articleRouter };
