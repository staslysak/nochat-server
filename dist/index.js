"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _chalk = _interopRequireDefault(require("chalk"));

var _config = _interopRequireDefault(require("./config"));

var _pubsub = _interopRequireDefault(require("./pubsub"));

var _models = _interopRequireDefault(require("./db/models"));

var _middleware = require("./middleware");

var _server = _interopRequireDefault(require("./server"));

const app = (0, _express.default)();
const initialContext = {
  db: _models.default,
  op: _models.default.op,
  pubsub: _pubsub.default
};
const server = (0, _server.default)(initialContext);
(0, _middleware.initMiddleware)(app, _models.default);
server.applyMiddleware({
  app
});

const httpServer = _http.default.createServer(app);

server.installSubscriptionHandlers(httpServer); // sync({ force: false })

_models.default.sequelize.authenticate().then(async () => {
  httpServer.listen(_config.default.PORT, () => {
    console.log(_chalk.default.blue(`
        Server ready at http://localhost:${_config.default.PORT}

        GraphQL ready at http://localhost:${_config.default.PORT}${server.graphqlPath}

        Client ready at http://localhost:${3000}
        `));
  });
});