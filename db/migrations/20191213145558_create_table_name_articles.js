exports.up = function(knex) {
  return knex.schema.createTable("articles", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title");
    articleTable.string("body", 8000);
    articleTable.integer("votes").defaultTo(0);
    articleTable.string("topic").references("topics.slug");
    articleTable.string("author").references("users.username");
    articleTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("articles");
};
