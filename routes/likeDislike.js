const Joi = require('joi');
const Model = require('../models');

module.exports = [{
  method: 'POST',
  path: '/book/{bookId}',
  config: {
    validate: {
      params: {
        bookId: Joi.number().integer().min(0).max(2000)
          .required(),
      },
      payload: {
        likeOrDislike: Joi.string().regex(/^like|dislike$/),
      },
    },
    cors: {
      origin: ['*'],
      additionalHeaders: ['cache-control', 'x-requested-with'],
    },
  },
  handler: async (request, h) => h.response(await Model.books.addLikeDislike(request.params.bookId, request.payload.likeOrDislike)).code(200),
}];
