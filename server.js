const Hapi = require('hapi');
const storeBooksAndRatingsRoute = require('./routes/storeBooksAndRatingsRoute.js');
const getBooksAndRatingsRoute = require('./routes/getBooksAndRatingsRoute.js');
const pingRoute = require('./routes/pingRoute.js');

const server = new Hapi.Server({
  port: 8080,
  host: 'localhost',
});

server.route([...pingRoute, ...getBooksAndRatingsRoute, ...storeBooksAndRatingsRoute]);
if (!module.parent) {
  server.start();
}

module.exports = { server };
