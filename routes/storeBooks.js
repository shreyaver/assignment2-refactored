const { storeBooksAndRatings } = require('../storeBooksAndRatings.js');

module.exports = [{
  method: 'GET',
  path: '/books/create',
  config: {
    cors: {
      origin: ['*'],
      additionalHeaders: ['cache-control', 'x-requested-with'],
    },
  },
  handler: async (request, h) => h.response(await storeBooksAndRatings()).code(200),
}];
