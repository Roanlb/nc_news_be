const userRouter = require("express").Router();
const { getUser, send405Error } = require("../controllers/controllers");

userRouter
  .route("/:username")
  .get(getUser)
  .all(send405Error);

module.exports = { userRouter };
