
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
  
  return books;
};
