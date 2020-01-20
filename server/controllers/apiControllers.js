function getEndpoints(req, res, next) {
  res
    .status(200)
    .send({
      endpoints: {
        '/api': 'GET',
        '/api/topics': 'GET',
        '/api/users/:username': 'GET',
        '/api/articles/:article_id (1)': 'GET',
        '/api/articles/:article_id (2)': 'PATCH',
        '/api/articles/:article_id/comments (1)': 'POST',
        '/api/articles/:article_id/comments (2)': 'GET',
        '/api/articles': 'GET',
        'api/comments/:comment_id (1)': 'PATCH',
        'api/comments/:comment_id (2)': 'DELETE'
      }
    })
    .catch(next);
}

module.exports = {
  getEndpoints
};
