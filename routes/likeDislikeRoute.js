const Joi = require('joi');
const Model = require('../models');

module.exports = [{
  method: 'POST',
  path: '/book/{bookId}/user/{userId}',
  config: {
    validate: {
      params: {
        bookId: Joi.number().integer().min(0).max(2000)
          .required(),
        userId: Joi.number().integer().min(0).max(2000)
          .required(),
      },
      payload: {
        likeOrDislike: Joi.string().regex(/^like|dislike$/),
      },
    },
  },
  handler: async (request, h) => h.response(await Model.books.addLikeDislike(request.params.bookId, request.params.userId, request.payload.likeOrDislike)).code(200),
}];
