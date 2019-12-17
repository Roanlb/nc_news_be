const apiRouter = require("express").Router();
const topicRouter = require("./topicRouter");
const usersRouter = require("./userRouter");

apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", usersRouter);

module.exports = { apiRouter, usersRouter };
