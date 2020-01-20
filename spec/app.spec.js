process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const chai = require('chai');
const { expect } = chai;
const chaiSorted = require('chai-sorted');
const knexion = require('../connection');
chai.use(chaiSorted);

describe('/api', () => {
  after(() => {
    return knexion.destroy();
  });
  beforeEach(() => {
    return knexion.seed.run();
  });
  describe('GET', () => {
    it('returns a JSON detailing all available endpoints', () => {
      return request
        .get('/api')
        .expect(200)
        .then(getAPIResponse => {
          expect(getAPIResponse.body).to.deep.equal({
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
          });
        });
    });
  });
  it('returns 404 not found when given a non-existent path', () => {
    return request
      .get('/api/topisc')
      .expect(404)
      .then(response => {
        expect(response.body.msg).to.equal('Not found');
      });
  });
  it('returns 405 if given an invalid method', () => {
    const invalidMethods = ['put', 'delete', 'patch', 'post'];
    const methodPromises = invalidMethods.map(method => {
      return request[method]('/api')
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal('Method not allowed');
        });
    });
  });
  describe('/topics', () => {
    describe('GET', () => {
      it('returns an array with each topic object', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.deep.equal([
              {
                description: 'The man, the Mitch, the legend',
                slug: 'mitch'
              },
              {
                description: 'Not dogs',
                slug: 'cats'
              },
              {
                description: 'what books are made of',
                slug: 'paper'
              }
            ]);
          });
      });
    });
    describe('invalid methods', () => {
      it('returns error 405 with message method not allowed', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request[method]('/api/topics')
            .expect(405)
            .then(response => {
              expect(response.body.msg).to.equal('Method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe('/users', () => {
    describe('/:username', () => {
      describe('GET', () => {
        it('returns 200 with the specified user', () => {
          return request
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(response => {
              expect(response.body.user).to.deep.equal({
                username: 'butter_bridge',
                avatar_url:
                  'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
                name: 'jonny'
              });
            });
        });
        it("returns 404 when given a username that doesn't exist", () => {
          return request
            .get('/api/users/butterbridge')
            .expect(404)
            .then(response => {
              expect(response.body).to.deep.equal({
                msg: 'User does not exist'
              });
            });
        });
      });
      describe('invalid methods', () => {
        it('returns error 405 with message method not allowed', () => {
          const invalidMethods = ['patch', 'put', 'delete'];
          const methodPromises = invalidMethods.map(method => {
            return request[method]('/api/users/butter_bridge')
              .expect(405)
              .then(response => {
                expect(response.body.msg).to.equal('Method not allowed');
              });
          });
        });
      });
    });
  });
  describe('/articles', () => {
    describe('GET', () => {
      it('responds with an array of articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(response => {
            response.body.articles.forEach(article => {
              expect(article).to.have.keys(
                'article_id',
                'title',
                'body',
                'votes',
                'topic',
                'author',
                'created_at',
                'comment_count'
              );
            });
          });
      });
      it('returns articles with functioning comment_count', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(response => {
            expect(response.body.articles[0].comment_count).to.equal('13');
            expect(response.body.articles[1].comment_count).to.equal('0');
          });
      });
      describe('author queries', () => {
        it('works with an author query', () => {
          return request
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(response => {
              response.body.articles.forEach(article => {
                expect(article.author).to.equal('butter_bridge');
              });
            });
        });
        it('returns 404 if given a nonexistent author query', () => {
          return request
            .get('/api/articles?author=bigmanroan')
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('User does not exist');
            });
        });
      });
      describe('topic queries', () => {
        it('works with a topic query', () => {
          return request
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(response => {
              response.body.articles.forEach(article => {
                expect(article.topic).to.equal('mitch');
              });
            });
        });
        it('returns 404 if given a nonexistent topic query', () => {
          return request
            .get('/api/articles?topic=pokemon')
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Topic does not exist');
            });
        });
      });
      describe('sort by queries', () => {
        it('returns the articles by specified sort by column', () => {
          return request
            .get('/api/articles?sort_by=votes')
            .expect(200)
            .then(response => {
              expect(response.body.articles).to.be.sortedBy('votes', {
                descending: true
              });
            });
        });
        it('returns 400 if given a nonexistent sort by column', () => {
          return request
            .get('/api/articles?sort_by=vtes')
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal(
                'Sort by column does not exist'
              );
            });
        });
      });
      describe('order queries', () => {
        it('returns the articles by descending order by default', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(response => {
              expect(response.body.articles).to.be.sortedBy('created_at', {
                descending: true
              });
            });
        });
        it('returns the articles in ascending order if specified', () => {
          return request
            .get('/api/articles?order=asc')
            .expect(200)
            .then(response => {
              expect(response.body.articles).to.be.sortedBy('created_at');
            });
        });
        it('returns 400 if given an order query which is not asc or desc', () => {
          return request
            .get('/api/articles?order=acs')
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Order must be asc or desc');
            });
        });
      });
      describe('combined queries', () => {
        it('works with multiple queries', () => {
          return request
            .get(
              '/api/articles?order=asc&sort_by=votes&topic=mitch&author=butter_bridge'
            )
            .expect(200)
            .then(response => {
              expect(response.body.articles).to.deep.equal([
                {
                  article_id: 9,
                  title: "They're not exactly dogs, are they?",
                  body: 'Well? Think about it.',
                  votes: 0,
                  topic: 'mitch',
                  author: 'butter_bridge',
                  created_at: '1986-11-23T12:21:54.171Z',
                  comment_count: '2'
                },
                {
                  article_id: 12,
                  title: 'Moustache',
                  body: 'Have you seen the size of that thing?',
                  votes: 0,
                  topic: 'mitch',
                  author: 'butter_bridge',
                  created_at: '1974-11-26T12:21:54.171Z',
                  comment_count: '0'
                },
                {
                  article_id: 1,
                  title: 'Living in the shadow of a great man',
                  body: 'I find this existence challenging',
                  votes: 100,
                  topic: 'mitch',
                  author: 'butter_bridge',
                  created_at: '2018-11-15T12:21:54.171Z',
                  comment_count: '13'
                }
              ]);
            });
        });
      });
    });
    describe('invalid methods', () => {
      it('returns method not allowed when given an invalid method request', () => {
        return request
          .patch('/api/articles')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method not allowed');
          });
      });
    });
    describe('/:article_id', () => {
      describe('GET', () => {
        it('returns the article object corresponding to the given id', () => {
          return request
            .get('/api/articles/1')
            .expect(200)
            .then(response => {
              expect(response.body.article).to.have.keys(
                'author',
                'title',
                'article_id',
                'body',
                'topic',
                'created_at',
                'votes',
                'comment_count'
              );
            });
        });
        it('returns a comment count which shows the number of comments associated with that article', () => {
          return request
            .get('/api/articles/1')
            .expect(200)
            .then(response => {
              expect(response.body.article.comment_count).to.equal('13');
            });
        });
        it('returns a votes key which defaults to 0', () => {
          return request
            .get('/api/articles/2')
            .expect(200)
            .then(response => {
              expect(response.body.article.votes).to.equal(0);
            });
        });
        it('returns a comment count which shows the number of comments associated with that article, for article 2', () => {
          return request
            .get('/api/articles/2')
            .expect(200)
            .then(response => {
              expect(response.body.article.comment_count).to.equal('0');
            });
        });
        it('returns 400 with an appropriate message when given an invalid article id', () => {
          return request
            .get('/api/articles/a')
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Invalid id');
            });
        });
        it('returns 404 with an appropriate message when given an valid nonexistent id', () => {
          return request
            .get('/api/articles/100')
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Article does not exist');
            });
        });
      });
      describe('PATCH', () => {
        it('returns an updated article with the votes property incremented', () => {
          return request
            .patch('/api/articles/1')
            .send({ inc_votes: 5 })
            .expect(200)
            .then(response => {
              expect(response.body.article).to.deep.equal({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                votes: 105,
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2018-11-15T12:21:54.171Z'
              });
            });
        });
        it('returns an updated article with the votes property incremented by 10', () => {
          return request
            .patch('/api/articles/2')
            .send({ inc_votes: 10 })
            .expect(200)
            .then(response => {
              expect(response.body.article.votes).to.equal(10);
            });
        });
        it('returns an updated article with the votes property incremented by a negative number', () => {
          return request
            .patch('/api/articles/1')
            .send({ inc_votes: -1 })
            .expect(200)
            .then(response => {
              expect(response.body.article.votes).to.equal(99);
            });
        });
        it('permanently updates the article so that a get request afterwards returns the edited article', () => {
          return request
            .patch('/api/articles/1')
            .send({ inc_votes: -1 })
            .expect(200)
            .then(() => {
              return request
                .get('/api/articles/1')
                .expect(200)
                .then(response => {
                  expect(response.body.article.votes).to.equal(99);
                });
            });
        });
        it('returns the unchanged article if given an empty body patch', () => {
          return request
            .patch('/api/articles/1')
            .send()
            .expect(200)
            .then(response => {
              expect(response.body.article).to.deep.equal({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                votes: 100,
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2018-11-15T12:21:54.171Z'
              });
            });
        });
        it('returns 400 if patch is sent to an invalid id', () => {
          return request
            .patch('/api/articles/a')
            .send({ inc_votes: 5 })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Invalid id');
            });
        });
        it('returns 404 if patch is sent to a valid nonexistent id', () => {
          return request
            .patch('/api/articles/100')
            .send({ inc_votes: 5 })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Article does not exist');
            });
        });
        // it("returns 400 if patch is sent with a malformed body", () => {
        //   return request
        //     .patch("/api/articles/2")
        //     .send({ inc_votse: 5 })
        //     .expect(400)
        //     .then(response => {
        //       expect(response.body.msg).to.equal("Malformed body");
        //     });
        // });
      });
    });
    describe('invalid methods', () => {
      it('returns error 405 with message method not allowed', () => {
        const invalidMethods = ['put', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request[method]('/api/articles/1')
            .expect(405)
            .then(response => {
              expect(response.body.msg).to.equal('Method not allowed');
            });
        });
      });
    });
    describe('/comments', () => {
      describe('POST', () => {
        it('adds a comment with the correct keys for a comment', () => {
          return request
            .post('/api/articles/1/comments')
            .send({ username: 'rogersop', body: 'noishe' })
            .expect(201)
            .then(response => {
              expect(response.body.comment).to.have.keys(
                'comment_id',
                'author',
                'votes',
                'created_at',
                'body'
              );
            });
        });
        it('adds a comment with the votes property defaulting to 0', () => {
          return request
            .post('/api/articles/1/comments')
            .send({ username: 'rogersop', body: 'noishe' })
            .expect(201)
            .then(response => {
              expect(response.body.comment.votes).to.equal(0);
            });
        });
        it('adds a comment with the author and body as specified', () => {
          return request
            .post('/api/articles/1/comments')
            .send({ username: 'rogersop', body: 'noishe' })
            .expect(201)
            .then(response => {
              expect(response.body.comment.author).to.equal('rogersop');
              expect(response.body.comment.body).to.equal('noishe');
            });
        });
        it('adds a comment with the corresponding article id', () => {
          return request
            .post('/api/articles/1/comments')
            .send({ username: 'rogersop', body: 'noishe' })
            .expect(201)
            .then(() => {
              return request
                .get('/api/articles/1/comments')
                .expect(200)
                .then(response => {
                  expect(response.body.comments[0].comment_id).to.equal(19);
                });
            });
        });
        it('returns status 404 if a valid but nonexistent article id is given', () => {
          return request
            .post('/api/articles/999/comments')
            .send({ username: 'rogersop', body: 'noishe' })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Not found');
            });
        });
        it('returns 400 if an invalid article id is given', () => {
          return request
            .post('/api/articles/abc/comments')
            .send({ username: 'rogersop', body: 'noishe' })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Invalid id');
            });
        });
        it('returns 400 if given a malformed body', () => {
          return request
            .post('/api/articles/2/comments')
            .send({ usernmae: 'rogersop', body: 'noishe' })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Malformed body');
            });
        });
      });
      describe('GET', () => {
        it('responds with an array of comments sorted by created_at descending by default', () => {
          return request
            .get('/api/articles/1/comments')
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.sortedBy('created_at', {
                descending: true
              });
            });
        });
        it('responds with an array of comments for the given article id', () => {
          return request
            .get('/api/articles/5/comments')
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.deep.equal([
                {
                  comment_id: 14,
                  author: 'icellusedkars',
                  votes: 16,
                  created_at: '2004-11-25T12:36:03.389Z',
                  body:
                    'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.'
                },
                {
                  comment_id: 15,
                  author: 'butter_bridge',
                  votes: 1,
                  created_at: '2003-11-26T12:36:03.389Z',
                  body: "I am 100% sure that we're not completely sure."
                }
              ]);
            });
        });
        it('responds with 404 when given a valid but nonexistent id', () => {
          return request
            .get('/api/articles/999/comments')
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Article does not exist');
            });
        });
        it('responds with 400 when given an invalid id', () => {
          return request
            .get('/api/articles/article2/comments')
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Invalid id');
            });
        });
        it('works with a sort by query', () => {
          return request
            .get('/api/articles/1/comments?sort_by=votes')
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.sortedBy('votes', {
                descending: true
              });
            });
        });
        it('returns 400 if given a non existent column', () => {
          return request
            .get('/api/articles/1/comments?sort_by=column2')
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal(
                'Sort by column does not exist'
              );
            });
        });
        it('works with an order query', () => {
          return request
            .get('/api/articles/1/comments?order=asc')
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.sortedBy('created_at');
            });
        });
        it('returns 400 if given an invalid order', () => {
          return request
            .get('/api/articles/1/comments?order=bbq')
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Order must be asc or desc');
            });
        });
        describe('invalid methods', () => {
          it('returns an appropriate error message if given an invalid method', () => {
            const invalidMethods = ['patch', 'put', 'delete'];
            const methodPromises = invalidMethods.map(method => {
              return request[method]('/api/articles/1/comments')
                .expect(405)
                .then(response => {
                  expect(response.body.msg).to.equal('Method not allowed');
                });
            });
          });
        });
      });
    });
  });
  describe('/comments', () => {
    describe('/:comment_id', () => {
      describe('PATCH', () => {
        it('returns the specified comment with the votes property updated by inc_votes', () => {
          return request
            .patch('/api/comments/1')
            .send({ inc_votes: 5 })
            .expect(200)
            .then(response => {
              expect(response.body.comment.votes).to.equal(21);
              expect(response.body.comment).to.deep.equal({
                comment_id: 1,
                author: 'butter_bridge',
                article_id: 9,
                votes: 21,
                created_at: '2017-11-22T12:36:03.389Z',
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it('increments properly for comment 2', () => {
          return request
            .patch('/api/comments/2')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(response => {
              expect(response.body.comment.votes).to.equal(15);
            });
        });
        it('works with negative numbers for inc_votes', () => {
          return request
            .patch('/api/comments/1')
            .send({ inc_votes: -5 })
            .expect(200)
            .then(response => {
              expect(response.body.comment.votes).to.equal(11);
              expect(response.body.comment).to.deep.equal({
                comment_id: 1,
                author: 'butter_bridge',
                article_id: 9,
                votes: 11,
                created_at: '2017-11-22T12:36:03.389Z',
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it('returns the unchanged comment when given an object without an inc_votes', () => {
          return request
            .patch('/api/comments/1')
            .send({})
            .expect(200)
            .then(response => {
              expect(response.body.comment).to.deep.equal({
                comment_id: 1,
                author: 'butter_bridge',
                article_id: 9,
                votes: 16,
                created_at: '2017-11-22T12:36:03.389Z',
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it('returns status 404 if given a valid but non-existent id', () => {
          return request
            .patch('/api/comments/999')
            .send({ inc_votes: 5 })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Comment does not exist');
            });
        });
        it('returns status 400 if given an invalid id', () => {
          return request
            .patch('/api/comments/butter_bridge')
            .send({ inc_votes: 5 })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Invalid id');
            });
        });
      });
      describe('DELETE', () => {
        it('returns status 204', () => {
          return request.delete('/api/comments/2').expect(204);
        });
        it('returns status 400 if given an invalid id', () => {
          return request
            .delete('/api/comments/the_beautiful_thing_about_treasure')
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Invalid id');
            });
        });
        it('returns status 404 if given a valid but non existent id', () => {
          return request
            .delete('/api/comments/200')
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Comment does not exist');
            });
        });
      });
    });
  });
});
