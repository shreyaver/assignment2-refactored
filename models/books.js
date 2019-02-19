
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
  books.generate = async (bookObj) => {
    try {
      const result = await books.findOrCreate({ where: { id: bookObj.id }, defaults: bookObj })
        .spread((user, created) => {
          if (created === true) {
            return `Inserted book with id: ${bookObj.id}`;
          }
          return `Book with id: ${bookObj.id} already exists`;
        });
      return result;
    } catch (errorObj) {
      return (errorObj.message);
    }
  };
  books.addLikeDislike = async (bookId, likeOrDislike) => {
    try {
      const book = await books.findById(bookId);
      if (book === null) {
        return (`Book with id: ${bookId} doesn't exist`);
      }
      let response = '';
      if (likeOrDislike === 'like') {
        if (book.likeOrDislike === 'like') {
          response += '\nBook already liked';
          return response;
        }
        const previousLikeOrDislike = book.likeOrDislike;
        await books.update({ likeOrDislike: 'like' }, { where: { id: bookId } });
        if (previousLikeOrDislike === 'dislike') {
          response += '\nRemoved dislike';
        }
        response += '\nBook liked!';
        return response;
      } if (likeOrDislike === 'dislike') {
        if (book.likeOrDislike === 'dislike') {
          response += '\nBook already disliked';
          return response;
        }
        const previousLikeOrDislike = book.likeOrDislike;
        await books.update({ likeOrDislike: 'dislike' }, { where: { id: bookId } });
        if (previousLikeOrDislike === 'like') {
          response += '\nRemoved like';
        }
        response += '\nBook disliked!';
        return response;
      }
    } catch (errorObj) {
      return errorObj.message;
    }
  };
  return books;
};
