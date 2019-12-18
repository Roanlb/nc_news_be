\c nc_news_test;

-- SELECT * FROM comments;

SELECT * FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = 1;


-- .select("articles.*")
--       .from("articles")
--       .where("articles.article_id", article_id)
--       .count({ comment_count: "articles.article_id" })
--       .leftJoin("comments", "articles.article_id", "comments.article_id")
--       .groupBy("articles.article_id")