const articleRouter = require("express").Router();
const { send405Error, getArticle } = require("../controllers/controllers");

articleRouter
  .route("/:article_id")
  .get(getArticle)
  .all(send405Error);

module.exports = { articleRouter };
