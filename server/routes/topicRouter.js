const topicRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topicController");
const { send405Error } = require("../errorHandlers/errorHandlers");

topicRouter
  .route("/")
  .get(getAllTopics)
  .all(send405Error);

module.exports = { topicRouter };
