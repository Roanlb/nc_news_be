exports.up = function(knex) {
  return knex.schema.createTable("articles", articleTable => {
    articleTable.integer("article_id").primary();
    articleTable.string("title");
    articleTable.string("body");
    articleTable.integer("votes").defaultTo(0);
    articleTable.string("topic").references("topics.slug");
    articleTable.string("author").references("users.username");
    articleTable.string("created_at").defaultTo(Date.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
