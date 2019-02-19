
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.removeColumn('books', 'likeOrDislike').then(queryInterface.addColumn('books', 'liked', {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn('books', 'liked').then(queryInterface.addColumn('books', 'likeOrDislike', {
    type: Sequelize.STRING,
    defaultValue: null,
  })),
};
