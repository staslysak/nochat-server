"use strict";

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _path = _interopRequireDefault(require("path"));

var _http = _interopRequireDefault(require("http"));

var _chalk = _interopRequireDefault(require("chalk"));

var _apolloServerExpress = require("apollo-server-express");

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _config = _interopRequireDefault(require("./config"));

var _pubsub = _interopRequireDefault(require("./pubsub"));

var _models = _interopRequireDefault(require("./db/models"));

var _middleware = require("./middleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)((0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, "./resolvers")));
const typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)((0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, "./types")), {
  all: true
});
const app = (0, _express.default)();
app.use((0, _cors.default)("*"));
app.use(_middleware.addUser);
app.use(_express.default.static(_path.default.join(__dirname, "../build")));
const server = new _apolloServerExpress.ApolloServer({
  typeDefs,
  resolvers,
  context: async (_ref) => {
    let {
      req,
      connection
    } = _ref;

    if (connection) {
      return connection.context;
    } else {
      const serverUrl = "".concat(req.protocol, "://").concat(req.get("host"));
      return {
        models: _models.default,
        op: _models.default.Sequelize.Op,
        pubsub: _pubsub.default,
        user: req.user,
        serverUrl
      };
    }
  },
  subscriptions: {
    onConnect: async connectionParams => {
      const user = await (0, _middleware.addUserConnection)(connectionParams.headers);
      return _objectSpread({}, connectionParams.headers, {
        models: _models.default,
        op: _models.default.Sequelize.Op,
        pubsub: _pubsub.default,
        user
      });
    }
  },
  playground: true
});
server.applyMiddleware({
  app
});
app.get("/*", (_, res) => res.sendFile(_path.default.join(__dirname, "../build", "index.html")));

const httpServer = _http.default.createServer(app);

server.installSubscriptionHandlers(httpServer); // sync

_models.default.sequelize.authenticate({
  force: false
}).then(async () => {
  httpServer.listen(_config.default.PORT, () => {
    console.log(_chalk.default.green("\n\n        \uD83D\uDE80 Server ready at http://localhost:".concat(_config.default.PORT, "\n\n        \uD83D\uDE80 GraphQL ready at http://localhost:").concat(_config.default.PORT).concat(server.graphqlPath, "\n\n        \uD83D\uDE80 Client ready at http://localhost:", 3000, "\n\n    ")));
  });
});