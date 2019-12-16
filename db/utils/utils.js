exports.formatDates = list => {
  let listCopy = [...list];

  listCopy = listCopy.map(item => {
    const formattedDate = new Date(item.created_at);
    item.created_at = formattedDate;
  });
};

exports.makeRefObj = (list, key, value) => {
  const refObj = {};
  list.forEach(article => {
    refObj[article[key]] = article[value];
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const newComments = [...comments];
  return newComments.map(comment => {
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
    comment.author = comment.created_by;
    comment.created_at = new Date(comment.created_at);
    delete comment.created_by;
    return comment;
  });
};
