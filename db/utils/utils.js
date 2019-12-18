exports.formatDates = list => {
  // let listCopy = [];

  // for (let i = 0; i < list.length; i++) {
  //   let obj = list[i];
  //   let copyObj = { ...obj };
  //   listCopy.push(copyObj);
  // }

  const listCopy = list.map(item => {
    const formattedDate = new Date(item.created_at);
    item.created_at = formattedDate;
    return item;
  });

  return listCopy;
};

exports.makeRefObj = (list, key, value) => {
  const refObj = {};
  list.forEach(article => {
    refObj[article[key]] = article[value];
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const newComment = { ...comment };
    newComment.article_id = articleRef[newComment.belongs_to];
    delete newComment.belongs_to;
    newComment.author = newComment.created_by;
    newComment.created_at = new Date(newComment.created_at);
    delete newComment.created_by;
    return newComment;
  });
};
