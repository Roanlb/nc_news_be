const commentRouter = require("express").Router();
const {
  send405Error,
  patchComment,
  deleteComment
} = require("../controllers/controllers");

commentRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(send405Error);

module.exports = { commentRouter };
