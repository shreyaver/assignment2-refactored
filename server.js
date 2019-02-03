const Hapi = require('hapi');
const booksAndRatingsRoute = require('./routes/booksAndRatingsRoute.js');
const pingRoute = require('./routes/pingRoute.js');

const server = new Hapi.Server({
  port: 8080,
  host: 'localhost',
});

server.route([...pingRoute, ...booksAndRatingsRoute]);
if (!module.parent) {
  server.start();
}

module.exports = { server };
