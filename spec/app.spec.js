process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const knexion = require("../db/data/connection");
chai.use(chaiSorted);

describe("/api", () => {
  after(() => {
    return knexion.destroy();
  });
  beforeEach(() => {
    return knexion.seed.run();
  });
  it("returns 404 not found when given a non-existent path", () => {
    return request
      .get("/api/topisc")
      .expect(404)
      .then(response => {
        expect(response.body.msg).to.equal("Not found");
      });
  });
  describe("/topics", () => {
    describe("GET", () => {
      it("returns an array with each topic object", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(response => {
            expect(response.body.topics).to.deep.equal([
              {
                description: "The man, the Mitch, the legend",
                slug: "mitch"
              },
              {
                description: "Not dogs",
                slug: "cats"
              },
              {
                description: "what books are made of",
                slug: "paper"
              }
            ]);
          });
      });
    });
    describe("invalid methods", () => {
      it("returns error 405 with message method not allowed", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/topics")
            .expect(405)
            .then(response => {
              expect(response.body.msg).to.equal("Method not allowed");
            });
        });
      });
    });
  });
  describe("/users", () => {
    describe("/:username", () => {
      describe("GET", () => {
        it("returns 200 with the specified user", () => {
          return request
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(response => {
              expect(response.body.user).to.deep.equal({
                username: "butter_bridge",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                name: "jonny"
              });
            });
        });
        it("returns 404 when given a username that doesn't exist", () => {
          return request
            .get("/api/users/butterbridge")
            .expect(404)
            .then(response => {
              expect(response.body).to.deep.equal({
                msg: "User does not exist"
              });
            });
        });
      });
      describe("invalid methods", () => {
        it("returns error 405 with message method not allowed", () => {
          const invalidMethods = ["patch", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request[method]("/api/users/butter_bridge")
              .expect(405)
              .then(response => {
                expect(response.body.msg).to.equal("Method not allowed");
              });
          });
        });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("responds with an array of articles", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(response => {
            response.body.articles.forEach(article => {
              expect(article).to.have.keys(
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at",
                "comment_count"
              );
            });
          });
      });
      it("returns articles with functioning comment_count", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(response => {
            expect(response.body.articles[0].comment_count).to.equal("13");
            expect(response.body.articles[1].comment_count).to.equal("0");
          });
      });
      describe("author queries", () => {
        it("works with an author query", () => {
          return request
            .get("/api/articles/?author=butter_bridge")
            .expect(200)
            .then(response => {
              response.body.articles.forEach(article => {
                expect(article.author).to.equal("butter_bridge");
              });
            });
        });
        it("returns 404 if given a nonexistent author query", () => {
          return request
            .get("/api/articles/?author=bigmanroan")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("User does not exist");
            });
        });
      });
      describe("topic queries", () => {
        it("works with a topic query", () => {
          return request
            .get("/api/articles/?topic=mitch")
            .expect(200)
            .then(response => {
              response.body.articles.forEach(article => {
                expect(article.topic).to.equal("mitch");
              });
            });
        });
        it("returns 404 if given a nonexistent topic query", () => {
          return request
            .get("/api/articles/?topic=pokemon")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("Topic does not exist");
            });
        });
      });
    });
    describe("invalid methods", () => {
      it("returns method not allowed when given an invalid method request", () => {
        return request
          .patch("/api/articles")
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal("Method not allowed");
          });
      });
    });
    describe("/:article_id", () => {
      describe("GET", () => {
        it("returns the article object corresponding to the given id", () => {
          return request
            .get("/api/articles/1")
            .expect(200)
            .then(response => {
              expect(response.body.article[0]).to.have.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
            });
        });
        it("returns a comment count which shows the number of comments associated with that article", () => {
          return request
            .get("/api/articles/1")
            .expect(200)
            .then(response => {
              expect(response.body.article[0].comment_count).to.equal("13");
            });
        });
        it("returns 400 with an appropriate message when given an invalid article id", () => {
          return request
            .get("/api/articles/a")
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Invalid id");
            });
        });
        it("returns 404 with an appropriate message when given an valid nonexistent id", () => {
          return request
            .get("/api/articles/100")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("Article does not exist");
            });
        });
      });
      describe("PATCH", () => {
        it("returns an updated article with the votes property incremented", () => {
          return request
            .patch("/api/articles/1")
            .send({ inc_votes: 5 })
            .expect(200)
            .then(response => {
              expect(response.body.article[0]).to.deep.equal({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 105,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z"
              });
            });
        });
        it("returns 400 if patch is sent to an invalid id", () => {
          return request
            .patch("/api/articles/a")
            .send({ inc_votes: 5 })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Invalid id");
            });
        });
        it("returns 404 if patch is sent to a valid nonexistent id", () => {
          return request
            .patch("/api/articles/100")
            .send({ inc_votes: 5 })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("Article does not exist");
            });
        });
        it("returns 400 if patch is sent with a malformed body", () => {
          return request
            .patch("/api/articles/2")
            .send({ inc_votse: 5 })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Malformed body");
            });
        });
      });
      describe("invalid methods", () => {
        it("returns error 405 with message method not allowed", () => {
          const invalidMethods = ["put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request[method]("/api/articles/1")
              .expect(405)
              .then(response => {
                expect(response.body.msg).to.equal("Method not allowed");
              });
          });
        });
      });
      describe("/comments", () => {
        describe("POST", () => {
          it("adds a comment with the correct keys for a comment", () => {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "rogersop", body: "noishe" })
              .expect(201)
              .then(response => {
                expect(response.body.comment[0]).to.have.keys(
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                );
              });
          });
          it("adds a comment with the corresponding article id", () => {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "rogersop", body: "noishe" })
              .expect(201)
              .then(response => {
                expect(response.body.comment[0].votes).to.equal(0);
                expect(response.body.comment[0].author).to.equal("rogersop");
                expect(response.body.comment[0].article_id).to.equal(1);
                expect(response.body.comment[0].body).to.equal("noishe");
              });
          });
          it("returns status 404 if a valid but nonexistent article id is given", () => {
            return request
              .post("/api/articles/999/comments")
              .send({ username: "rogersop", body: "noishe" })
              .expect(404)
              .then(response => {
                expect(response.body.msg).to.equal("Not found");
              });
          });
          it("returns 400 if an invalid article id is given", () => {
            return request
              .post("/api/articles/abc/comments")
              .send({ username: "rogersop", body: "noishe" })
              .expect(400)
              .then(response => {
                expect(response.body.msg).to.equal("Invalid id");
              });
          });
          it("returns 400 if given a malformed body", () => {
            return request
              .post("/api/articles/2/comments")
              .send({ usernmae: "rogersop", body: "noishe" })
              .expect(400)
              .then(response => {
                expect(response.body.msg).to.equal("Malformed body");
              });
          });
        });
        describe("GET", () => {
          it("responds with an array of comments sorted by created_at descending by default", () => {
            return request
              .get("/api/articles/1/comments")
              .expect(200)
              .then(response => {
                expect(response.body.comments).to.be.sortedBy("created_at", {
                  descending: true
                });
              });
          });
          it("responds with an array of comments for the given article id", () => {
            return request
              .get("/api/articles/5/comments")
              .expect(200)
              .then(response => {
                expect(response.body.comments).to.deep.equal([
                  {
                    comment_id: 14,
                    author: "icellusedkars",
                    article_id: 5,
                    votes: 16,
                    created_at: "2004-11-25T12:36:03.389Z",
                    body:
                      "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge."
                  },
                  {
                    comment_id: 15,
                    author: "butter_bridge",
                    article_id: 5,
                    votes: 1,
                    created_at: "2003-11-26T12:36:03.389Z",
                    body: "I am 100% sure that we're not completely sure."
                  }
                ]);
              });
          });
          it("works with a sort by query", () => {
            return request
              .get("/api/articles/1/comments?sort_by=votes")
              .expect(200)
              .then(response => {
                expect(response.body.comments).to.be.sortedBy("votes", {
                  descending: true
                });
              });
          });
          it("works with an order query", () => {
            return request
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then(response => {
                expect(response.body.comments).to.be.sortedBy("created_at");
              });
          });
        });
        describe("invalid methods", () => {
          it("returns an appropriate error message if given an invalid method", () => {
            const invalidMethods = ["patch", "put", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/articles/1/comments")
                .expect(405)
                .then(response => {
                  expect(response.body.msg).to.equal("Method not allowed");
                });
            });
          });
        });
      });
    });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH", () => {
        it("returns the specified comment with the votes property updated by inc_votes", () => {
          return request
            .patch("/api/comments/1")
            .send({ inc_votes: 5 })
            .expect(200)
            .then(response => {
              expect(response.body.comment[0].votes).to.equal(21);
              expect(response.body.comment[0]).to.deep.equal({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 21,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it("works with negative numbers for inc_votes", () => {
          return request
            .patch("/api/comments/1")
            .send({ inc_votes: -5 })
            .expect(200)
            .then(response => {
              expect(response.body.comment[0].votes).to.equal(11);
              expect(response.body.comment[0]).to.deep.equal({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 11,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it("returns status 404 if given a valid but non-existent id", () => {
          return request
            .patch("/api/comments/999")
            .send({ inc_votes: 5 })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("Comment does not exist");
            });
        });
        it("returns status 400 if given an invalid id", () => {
          return request
            .patch("/api/comments/butter_bridge")
            .send({ inc_votes: 5 })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Invalid id");
            });
        });
      });
      describe("DELETE", () => {
        it("returns status 204", () => {
          return request.delete("/api/comments/2").expect(204);
        });
        it("returns status 400 if given an invalid id", () => {
          return request
            .delete("/api/comments/the_beautiful_thing_about_treasure")
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Invalid id");
            });
        });
        it("returns status 404 if given a valid but non existent id", () => {
          return request
            .delete("/api/comments/200")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("Comment does not exist");
            });
        });
      });
    });
  });
});
