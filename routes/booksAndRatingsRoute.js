const { storeBooksAndRatings } = require('../getBooksAndRatings.js');

module.exports = [{
  method: 'GET',
  path: '/books',
  handler: async (request, h) => h.response(await storeBooksAndRatings()).code(200),
}];
