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
          it("returns 405 if given a malformed body", () => {
            return request
              .post("/api/articles/2/comments")
              .send({ usernmae: "rogersop", body: "noishe" })
              .expect(400)
              .then(response => {
                expect(response.body.msg).to.equal("Malformed body");
              });
          });
        });
        describe.only("GET", () => {
          it.only("responds with an array of comments for the given article id", () => {
            return request
              .get("/api/articles/1/comments")
              .expect(200)
              .then(response => {
                console.log(response.body.comments, "array of comments");
                expect(response.body.comments).to.be.sortedBy("created_at", {
                  descending: true
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
                .get("/api/articles/1/comments?sort_by=votes")
                .expect(200)
                .then(response => {
                  expect(response.body.comments).to.be.sortedBy("votes", {
                    descending: true
                  });
                });
            });
            it("works with a desc query", () => {});
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
  });
});
