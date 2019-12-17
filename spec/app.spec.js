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
});
