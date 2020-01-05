const userRouter = require("express").Router();
const { getUser } = require("../controllers/userControllers");
const { send405Error } = require("../errorHandlers/errorHandlers");

userRouter
  .route("/:username")
  .get(getUser)
  .all(send405Error);

module.exports = { userRouter };
