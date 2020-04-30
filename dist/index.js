"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _chalk = _interopRequireDefault(require("chalk"));

var _apolloServerExpress = require("apollo-server-express");

var _config = _interopRequireDefault(require("./config"));

var _pubsub = _interopRequireDefault(require("./pubsub"));

var _models = _interopRequireDefault(require("./db/models"));

var _middleware = require("./middleware");

var _auth = require("./utils/auth");

var _types = require("./types");

var _resolvers = require("./resolvers");

const app = (0, _express.default)();
(0, _middleware.initMiddleware)(app, _models.default);
const server = new _apolloServerExpress.ApolloServer({
  typeDefs: _types.typeDefs,
  resolvers: _resolvers.resolvers,
  context: async ({
    req,
    connection
  }) => {
    if (connection) {
      return connection.context;
    } else {
      const serverUrl = `${req.protocol}://${req.get("host")}`;
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
      try {
        if (connectionParams["x-token"] && connectionParams["x-refresh-token"]) {
          const user = await (0, _auth.verifyTokenConnection)(connectionParams, _models.default);

          if (user) {
            await (0, _auth.connectUser)({
              models: _models.default,
              pubsub: _pubsub.default,
              user
            });
          }

          return {
            models: _models.default,
            op: _models.default.Sequelize.Op,
            pubsub: _pubsub.default,
            user
          };
        }
      } catch (error) {
        throw new Error("Unauthorized!");
      }
    },
    onDisconnect: async (_, context) => {
      const initialContext = await context.initPromise;

      if (initialContext && initialContext.user) {
        await (0, _auth.disconnectUser)(initialContext);
      }
    }
  },
  playground: process.env.NODE_ENV !== "production"
});
server.applyMiddleware({
  app
});

const httpServer = _http.default.createServer(app);

server.installSubscriptionHandlers(httpServer); // sync({ force: false })

_models.default.sequelize.sync().then(async () => {
  httpServer.listen(_config.default.PORT, () => {
    console.log(_chalk.default.green(`
        Server ready at http://localhost:${_config.default.PORT}

        GraphQL ready at http://localhost:${_config.default.PORT}${server.graphqlPath}

        Client ready at http://localhost:${3000}
    `));
  });
});