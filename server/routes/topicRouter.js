const topicRouter = require("express").Router();
const { getAllTopics, send405Error } = require("../controllers/controllers");

topicRouter
  .route("/")
  .get(getAllTopics)
  .all(send405Error);

module.exports = { topicRouter };
