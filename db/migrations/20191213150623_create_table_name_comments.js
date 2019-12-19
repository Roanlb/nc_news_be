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
      .onDelete("CASCADE")
      .notNullable();
    commentTable.integer("votes").defaultTo(0);
    commentTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentTable.string("body", 8000).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("comments");
};
