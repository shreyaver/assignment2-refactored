const { storeBooksAndRatings } = require('../storeBooksAndRatings.js');

module.exports = [{
  method: 'GET',
  path: '/books/database',
  handler: async (request, h) => h.response(await storeBooksAndRatings()).code(200),
}];
