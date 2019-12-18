const articleRouter = require("express").Router();
const {
  send405Error,
  getArticle,
  patchArticle
} = require("../controllers/controllers");

articleRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(send405Error);

module.exports = { articleRouter };
