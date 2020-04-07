const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex('topics').insert(topicData).returning('*');
      const usersInsertions = knex('users').insert(userData).returning('*');

      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(([topicsRows, userRows]) => {
      const formattedArticles = formatDates(articleData);
      return knex.insert(formattedArticles).into('articles').returning('*');
    })
    .then((articleRows) => {
      let refObj = makeRefObj(articleRows, 'title', 'article_id');
      let formattedComments = formatComments(commentData, refObj);
      return knex.insert(formattedComments).into('comments').returning('*');
    });
};
