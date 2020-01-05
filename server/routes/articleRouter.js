const articleRouter = require("express").Router();
const {
  getArticle,
  patchArticle,
  postComment,
  getComments,
  getArticles
} = require("../controllers/articleControllers");
const { send405Error } = require("../errorHandlers/errorHandlers");

articleRouter
  .route("/")
  .get(getArticles)
  .all(send405Error);

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
