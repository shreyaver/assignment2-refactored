
module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    Author: DataTypes.STRING,
    Name: DataTypes.STRING,
    rating: DataTypes.DECIMAL,
  }, {});

  return books;
};
