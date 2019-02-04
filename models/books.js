
module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    Author: DataTypes.STRING,
    Name: DataTypes.STRING,
    rating: DataTypes.DECIMAL,
    likesDislikes: DataTypes.JSON,
  }, {});
  books.generate = bookObj => new Promise((resolve, reject) => {
    books.findOrCreate({ where: { id: bookObj.id }, defaults: bookObj })
      .spread((user, created) => {
        if (created === true) {
          resolve(`Inserted book with id: ${bookObj.id}`);
        } else {
          resolve(`Book with id: ${bookObj.id} already exists`);
        }
      }).catch((errorObj) => {
        resolve(errorObj.message);
      });
  });
  books.addLikeDislike = (bookId, userId, likeOrDislike) => new Promise((resolve, reject) => {
    books.findById(bookId).then((book) => {
      if (book === null) {
        resolve(`Book with id: ${bookId} doesn't exist`);
      } else {
        const { likedBy, dislikedBy } = book.likesDislikes;
        const likeIndexOfUser = likedBy.indexOf(userId);
        const dislikeIndexOfUser = dislikedBy.indexOf(userId);
        let response = '';
        if (likeOrDislike === 'like') {
          if (dislikeIndexOfUser > -1) {
            dislikedBy.splice(dislikeIndexOfUser, 1);
            response += '\nRemoved dislike';
          }
          if (likeIndexOfUser === -1) {
            likedBy.push(userId);
            response += '\nBook liked!';
            books.update({ likesDislikes: book.likesDislikes }, { where: { id: bookId } }).then(() => {
              resolve(response);
            });
          } else {
            response += '\nBook already liked';
            resolve(response);
          }
        } else {
          if (likeIndexOfUser > -1) {
            likedBy.splice(likeIndexOfUser, 1);
            response += '\nRemoved like';
          }
          if (dislikeIndexOfUser === -1) {
            dislikedBy.push(userId);
            response += '\nBook disliked!';
            books.update({ likesDislikes: book.likesDislikes }, { where: { id: bookId } }).then(() => {
              resolve(response);
            });
          } else {
            response += '\nBook already disliked';
            resolve(response);
          }
        }
      }
    });
  });
  return books;
};
