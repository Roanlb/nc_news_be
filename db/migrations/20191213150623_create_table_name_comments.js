exports.up = function(knex) {
  return knex.schema.createTable("comments", commentTable => {
    commentTable.increments("comment_id").primary();
    commentTable
      .string("author")
      .references("users.username")
      .notNullable();
    commentTable
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    commentTable.integer("votes").defaultTo(0);
    commentTable.string("created_at").defaultTo(Date.now());
    commentTable.string("body", 8000).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("comments");
};
