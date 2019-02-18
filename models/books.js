
module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    Author: DataTypes.STRING,
    Name: DataTypes.STRING,
    rating: DataTypes.DECIMAL,
    likeOrDislike: DataTypes.STRING,
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
  books.addLikeDislike = (bookId, likeOrDislike) => new Promise((resolve, reject) => {
    books.findById(bookId).then((book) => {
      if (book === null) {
        resolve(`Book with id: ${bookId} doesn't exist`);
      } else {
        let response = '';
        if (likeOrDislike === 'like') {
          if (book.likeOrDislike === 'like') {
            response += '\nBook already liked';
            resolve(response);
          } else {
            const previousLikeOrDislike = book.likeOrDislike;
            books.update({ likeOrDislike: 'like' }, { where: { id: bookId } }).then(() => {
              if (previousLikeOrDislike === 'dislike') {
                response += '\nRemoved dislike';
              }
              response += '\nBook liked!';
              resolve(response);
            }).catch((errorObj) => {
              resolve(errorObj.message);
            });
          }
        } else if (likeOrDislike === 'dislike') {
          if (book.likeOrDislike === 'dislike') {
            response += '\nBook already disliked';
            resolve(response);
          } else {
            const previousLikeOrDislike = book.likeOrDislike;
            books.update({ likeOrDislike: 'dislike' }, { where: { id: bookId } }).then(() => {
              if (previousLikeOrDislike === 'like') {
                response += '\nRemoved like';
              }
              response += '\nBook disliked!';
              resolve(response);
            }).catch((errorObj) => {
              resolve(errorObj.message);
            });
          }
        }
      }
    }).catch((errorObj) => {
      resolve(errorObj.message);
    });
  });
  return books;
};
