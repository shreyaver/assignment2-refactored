

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('books', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    Author: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rating: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('books'),
};
