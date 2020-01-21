function send405Error(req, res, next) {
  res.status(405).send({ msg: 'Method not allowed' });
}

function sendMalformedBodyError(err, req, res, next) {
  res.status(400).send({ msg: err.msg });
}

function sendOrderError(err, req, res, next) {
  res.status(400).send({ msg: err.msg });
}

function sendSortByError(err, req, res, next) {
  res.status(400).send({ msg: 'Sort by column does not exist' });
}

function sendVertasileIdError(err, req, res, next) {
  res.status(404).send({ msg: err.msg });
}

function sendInvalidIdError(err, req, res, next) {
  res.status(400).send({ msg: 'Invalid id' });
}

function sendNotFoundError(err, req, res, next) {
  res.status(404).send({ msg: 'Not found' });
}

module.exports = {
  send405Error,
  sendMalformedBodyError,
  sendOrderError,
  sendSortByError,
  sendVertasileIdError,
  sendInvalidIdError,
  sendNotFoundError
};
