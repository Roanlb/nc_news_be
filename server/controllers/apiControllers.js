function getEndpoints(req, res, next) {
  res
    .status(200)
    .send({
      endpoints: {
        "/api": "GET",
        "/api/topics": "GET",
        "/api/users/:username": "GET",
        "/api/articles/:article_id": "GET",
        "/api/articles/:article_id": "PATCH",
        "/api/articles/:article_id/comments": "POST",
        "/api/articles/:article_id/comments": "GET",
        "/api/articles": "GET",
        "api/comments/:comment_id": "PATCH",
        "api/comments/:comment_id": "DELETE"
      }
    })
    .catch(next);
}

module.exports = {
  getEndpoints
};
