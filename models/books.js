
module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    Author: DataTypes.STRING,
    Name: DataTypes.STRING,
    rating: DataTypes.DECIMAL,
    liked: DataTypes.BOOLEAN,
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
  books.addLikeDislike = async (bookId, liked) => {
    try {
      const book = await books.findById(bookId);
      if (book === null) {
        return (`Book with id: ${bookId} doesn't exist`);
      }
      let response = '';
      if (liked === true) {
        if (book.liked === true) {
          response += '\nBook already liked';
          return response;
        }
        const previousLiked = book.liked;
        await books.update({ liked: true }, { where: { id: bookId } });
        if (previousLiked === false) {
          response += '\nRemoved dislike';
        }
        response += '\nBook liked!';
        return response;
      } if (liked === false) {
        if (book.liked === false) {
          response += '\nBook already disliked';
          return response;
        }
        const previousLiked = book.liked;
        await books.update({ liked: false }, { where: { id: bookId } });
        if (previousLiked === true) {
          response += '\nRemoved like';
        }
        response += '\nBook disliked!';
        return response;
      }
    } catch (errorObj) {
      return errorObj.message;
    }
  };
  books.getBookLikedById = async (bookId) => {
    try {
      const book = await books.findById(bookId);
      return book.liked;
    } catch (errorObj) {
      return errorObj.message;
    }
  };
  return books;
};
