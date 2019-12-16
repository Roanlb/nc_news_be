process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const knexion = require("../db/data/connection");
chai.use(chaiSorted);

after(() => {
  return knexion.destroy();
});

describe("/api", () => {
  describe("/topics", () => {
    describe("GET", () => {
      it("returns an array with each topic object", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(response => {
            console.log("got response");
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
  });
});