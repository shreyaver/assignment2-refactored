
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.removeColumn('books', 'likesDislikes').then(queryInterface.addColumn('books', 'likeOrDislike', {
    type: Sequelize.STRING,
    defaultValue: null,
  })),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn('books', 'likeOrDislike').then(queryInterface.addColumn('books', 'likesDislikes', {
    type: Sequelize.JSON,
    defaultValue: { likedBy: [], dislikedBy: [] },
  })),
};
