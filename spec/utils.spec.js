const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("when given an array of one object, returns an identical array except for the timestamp property converted to psql", () => {
    const list = [{ created_at: 1466622625 }];
    expect(formatDates(list)[0].created_at instanceof Date).to.equal(true);
  });
  it("takes an array of objects with timestamp properties and converts the timestamp to a psql timestamp", () => {
    const time1 = Date.now();
    const time2 = Date.now();
    const time3 = Date.now();

    const timeArticles = [
      { created_at: time1 },
      { created_at: time2 },
      { created_at: time3 }
    ];

    const newTimes = formatDates(timeArticles);
    for (let i = 0; i < newTimes.length; i++) {
      expect(newTimes[i].created_at instanceof Date).to.equal(true);
    }
  });
  it("does not mutate original", () => {
    const time1 = Date.now();
    const time2 = Date.now();
    const time3 = Date.now();

    const timeArticles = [
      { created_at: time1 },
      { created_at: time2 },
      { created_at: time3 }
    ];

    const newTimes = formatDates(timeArticles);
    for (let i = 0; i < newTimes.length; i++) {
      expect(timeArticles[i].created_at instanceof Date).to.equal(false);
    }
  });
});

describe("makeRefObj", () => {
  it("takes an array of article objects and returns a reference object with title keys and id values", () => {
    const articles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];

    expect(makeRefObj(articles, "title", "article_id")).to.deep.equal({
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 2
    });
  });
  it("does not mutate original array", () => {
    const articles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    makeRefObj(articles, "title", "article_id");
    expect(articles).to.deep.equal([
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ]);
  });
});

describe("formatComments", () => {
  it("takes an array of comments and an article reference object to replace the article title with the article id", () => {
    const articles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];

    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "Eight pug gifs that remind me of mitch",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];

    const articleRef = makeRefObj(articles, "title", "article_id");

    expect(formatComments(comments, articleRef)).to.deep.equal([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      },
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 2,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ]);
  });
  it("does not mutate original array", () => {
    const articles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];

    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "Eight pug gifs that remind me of mitch",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];

    const articleRef = makeRefObj(articles, "title", "article_id");

    formatComments(comments, articleRef);

    expect(comments).to.deep.equal([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "Eight pug gifs that remind me of mitch",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
});
