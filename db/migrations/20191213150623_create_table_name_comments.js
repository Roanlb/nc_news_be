exports.up = function(knex) {
  return knex.schema.createTable("comments", commentTable => {
    commentTable.increments("comment id").primary();
    commentTable.string("author").references("users.username");
    commentTable.integer("article_id").references("articles.article_id");
    commentTable.integer("votes").defaultTo(0);
    commentTable.string("created_at").defaultTo(Date.now());
    commentTable.string("body", 8000).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
