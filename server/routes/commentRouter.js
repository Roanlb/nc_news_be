const commentRouter = require("express").Router();
const {
  patchComment,
  deleteComment
} = require("../controllers/commentControllers");
const { send405Error } = require("../errorHandlers/errorHandlers");

commentRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(send405Error);

module.exports = { commentRouter };
