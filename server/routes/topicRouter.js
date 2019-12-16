const topicRouter = require("express").Router();
const { getAllTopics } = require("../controllers/controllers");

console.log(getAllTopics, "<exported and received topic controller");

topicRouter.get("/", getAllTopics);

module.exports = topicRouter;
