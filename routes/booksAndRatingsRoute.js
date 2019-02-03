const { getBooksAndRatings } = require('../getBooksAndRatings.js');

module.exports = [{
  method: 'GET',
  path: '/books',
  handler: async (request, h) => h.response(await getBooksAndRatings()).code(200),
}];
