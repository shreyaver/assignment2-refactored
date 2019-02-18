const { getBooksAndRatings } = require('../getBooksAndRatings.js');

module.exports = [{
  method: 'GET',
  path: '/books',
  config: {
    cors: {
      origin: ['*'],
      additionalHeaders: ['cache-control', 'x-requested-with'],
    },
  },
  handler: async (request, h) => h.response(await getBooksAndRatings()).code(200),
}];
