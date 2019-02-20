const Joi = require('joi');
const Model = require('../models');

module.exports = [{
  method: 'GET',
  path: '/book/{bookId}',
  config: {
    validate: {
      params: {
        bookId: Joi.number().integer().min(0).max(2000)
          .required(),
      },
    },
    cors: {
      origin: ['*'],
      additionalHeaders: ['cache-control', 'x-requested-with'],
    },
  },
  handler: async (request, h) => h.response(await Model.books.getBookLikedById(request.params.bookId)).code(200),
}];
