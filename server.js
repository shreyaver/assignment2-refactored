const Hapi = require('hapi');
const storeBooksAndRatingsRoute = require('./routes/storeBooks.js');
const getBooksAndRatingsRoute = require('./routes/books.js');
const likeDislikeRoute = require('./routes/likeDislike.js');
const pingRoute = require('./routes/ping.js');

const server = new Hapi.Server({
  port: 8080,
  host: 'localhost',
});

server.route([...pingRoute, ...getBooksAndRatingsRoute, ...storeBooksAndRatingsRoute, ...likeDislikeRoute]);
if (!module.parent) {
  server.start();
}

module.exports = { server };
