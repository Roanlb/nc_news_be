const express = require('express');
const app = express();
const cors = require('cors');
const { apiRouter } = require('./server/routes/apiRouter');
const {
  sendMalformedBodyError,
  sendOrderError,
  sendSortByError,
  sendVertasileIdError,
  sendInvalidIdError,
  sendNotFoundError
} = require('./server/errorHandlers/errorHandlers');

app.use(express.json());
app.use(cors());
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  if (err.msg === 'Malformed body') {
    sendMalformedBodyError(err, req, res, next);
  }
  if (err.msg === 'Order must be asc or desc') {
    sendOrderError(err, res, res, next);
  }
  if (err.code === '42703') {
    sendSortByError(err, req, res, next);
  }
  if (
    (err.status === 404 && err.msg === 'User does not exist') ||
    (err.status === 404 && err.msg === 'Article does not exist') ||
    (err.status === 404 && err.msg === 'Comment does not exist') ||
    (err.status === 404 && err.msg === 'Topic does not exist')
  ) {
    sendVertasileIdError(err, req, res, next);
  } else if (err.code === '22P02') sendInvalidIdError(err, req, res, next);
  else sendNotFoundError(err, req, res, next);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal server error' });
});

apiRouter.all('/*', (req, res, next) => {
  sendNotFoundError(err, req, res, next);
});

module.exports = app;
