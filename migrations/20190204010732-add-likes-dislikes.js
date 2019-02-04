

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('books', 'likesDislikes', {
    type: Sequelize.JSON,
    defaultValue: { likedBy: [], dislikedBy: [] },
  }),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn('books', 'likesDislikes'),
};
