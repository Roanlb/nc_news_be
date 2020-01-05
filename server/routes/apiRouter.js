const apiRouter = require("express").Router();
const { topicRouter } = require("./topicRouter");
const { userRouter } = require("./userRouter");
const { articleRouter } = require("./articleRouter");
const { commentRouter } = require("./commentRouter");
const { getEndpoints } = require("../controllers/controllers");
const { send405Error } = require("../errorHandlers/errorHandlers");

apiRouter
  .route("/")
  .get(getEndpoints)
  .all(send405Error);

apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = { apiRouter };
