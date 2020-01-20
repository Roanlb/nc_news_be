function getEndpoints(req, res, next) {
  res
    .status(200)
    .send({
      endpoints: {
        'GET /api': {
          description:
            'serves up a json representation of all the available endpoints of the api'
        },
        'GET /api/topics': {
          description: 'serves an array of all topics',
          queries: [],
          exampleResponse: {
            topics: [{ slug: 'football', description: 'Footie!' }]
          }
        },
        'GET /api/articles': {
          description: 'serves an array of all topics',
          queries: ['author', 'topic', 'sort_by', 'order'],
          exampleResponse: {
            articles: [
              {
                title: 'Seafood substitutions are increasing',
                topic: 'cooking',
                author: 'weegembump',
                body: 'Text from the article..',
                created_at: 1527695953341
              }
            ]
          }
        },
        'GET /api/articles/:article_id': {
          description: 'serves an object detailing the specified article',
          queries: [],
          exampleResponse: {
            article: {
              article_id: 24,
              title:
                'Game of talents: management lessons from top football coaches',
              body: 'Text from the article...',
              votes: 0,
              topic: 'football',
              author: 'jessjelly',
              created_at: '2017-04-01T10:54:48.304Z',
              comment_count: '5'
            }
          }
        },
        'PATCH /api/articles/:article_id': {
          description:
            "takes a vote increment object and uses this to modify the specified article's votes, returning the article",
          queries: [],
          exampleRequest: { inc_votes: 1 },
          exampleResponse: {
            article: {
              article_id: 24,
              title:
                'Game of talents: management lessons from top football coaches',
              body: 'Text from the article...',
              votes: 1,
              topic: 'football',
              author: 'jessjelly',
              created_at: '2017-04-01T10:54:48.304Z',
              comment_count: '5'
            }
          }
        },
        'POST /api/articles/:article_id/comments': {
          description:
            'takes a comment with a username and body key and returns the posted comment',
          queries: [],
          exampleRequest: { username: 'weegembump', body: 'Nice' },
          exampleResponse: {
            comment_id: 19,
            author: 'weegembum',
            votes: 0,
            created_at: '2020-01-20T09: 50: 31.854Z',
            body: 'Nice'
          }
        },
        'GET /api/articles/:article_id/comments': {
          description:
            'serves an array of comments for the specified article id',
          queries: ['sort_by', 'order'],
          exampleResponse: {
            comments: [
              {
                comment_id: 164,
                author: 'cooljmessy',
                votes: 12,
                created_at: '2017-10-31T00:41:18.506Z',
                body:
                  'Qui aut nihil temporibus enim. Consequatur officiis quia. Sit vero eum.'
              },
              {
                comment_id: 83,
                author: 'weegembump',
                votes: -2,
                created_at: '2017-08-21T21:20:14.277Z',
                body:
                  'Velit in assumenda quo repudiandae qui eaque. Qui dolor ad iusto optio magnam suscipit.'
              },
              {
                comment_id: 235,
                author: 'jessjelly',
                votes: 4,
                created_at: '2017-07-19T00:27:44.985Z',
                body:
                  'Beatae aut et est optio ut magni hic. Unde reprehenderit quam reiciendis laborum possimus distinctio veritatis. Nostrum corrupti minus voluptatem veritatis quis aspernatur totam. Atque nisi et labore repellat officia quia pariatur cumque.'
              }
            ]
          }
        },
        'GET /api/users/:username': {
          description: 'serves an object detailing the specified user',
          queries: [],
          exampleResponse: {
            user: {
              username: 'weegembump',
              avatar_url:
                'https://www.upandrunning.co.uk/media/catalog/product/cache/1/image/650x/040ec09b1e35df139433887a97daa66f/m/r/mr-bump.jpg',
              name: 'Gemma Bump'
            }
          }
        },
        'PATCH /api/comments/:comment_id': {
          description:
            "takes an object with a vote incremenet property and incremenets the specified comment's votes by that number",
          queries: [],
          exampleRequest: { inc_votes: 2 },
          exampleResponse: {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 105,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: '2018-11-15T12: 21: 54.171Z'
          }
        },
        'DELETE /api/comments/comment_id': {
          description: 'deletes the specified comment',
          queries: []
        }
      }
    })
    .catch(next);
}

module.exports = {
  getEndpoints
};
