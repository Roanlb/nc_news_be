const apiRouter = require("express").Router();
const { topicRouter } = require("./topicRouter");
const { userRouter } = require("./userRouter");

apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);

module.exports = { apiRouter };
