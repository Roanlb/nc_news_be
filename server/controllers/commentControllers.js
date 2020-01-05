const {
  amendComment,
  checkParentCommentExists,
  obliterateComment
} = require("../models/commentModels");

function patchComment(req, res, next) {
  const comment_id = req.params.comment_id;
  const inc_votes = req.body.inc_votes;
  Promise.all([
    checkParentCommentExists(comment_id),
    amendComment(comment_id, inc_votes)
  ])
    .then(responseThings => {
      res.status(200).send({ comment: responseThings[1][0] });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const comment_id = req.params.comment_id;
  Promise.all([
    checkParentCommentExists(comment_id),
    obliterateComment(comment_id)
  ])
    .then(responseThings => {
      res.sendStatus(204);
    })
    .catch(next);
}

module.exports = { deleteComment, patchComment };
