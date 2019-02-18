const { storeBooksAndRatings } = require('../storeBooksAndRatings.js');

module.exports = [{
  method: 'GET',
  path: '/books/create',
  handler: async (request, h) => h.response(await storeBooksAndRatings()).code(200),
}];
