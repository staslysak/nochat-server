"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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

var _auth = require("./utils/auth");

const resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)((0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, "./resolvers")));
const typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)((0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, "./types")), {
  all: true
});
const app = (0, _express.default)();
app.use((0, _cors.default)("*"));
app.use((0, _middleware.addUser)(_models.default));
app.use(_express.default.static(_path.default.join(__dirname, "../build")));
const server = new _apolloServerExpress.ApolloServer({
  typeDefs,
  resolvers,
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
          const user = await (0, _middleware.addUserConnection)(connectionParams, _models.default);

          if (user) {
            await (0, _auth.onConnect)({
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
        await (0, _auth.onDisconnect)(initialContext);
      }
    }
  },
  playground: process.env.NODE_ENV !== "production"
});
server.applyMiddleware({
  app
});
app.get("/*", (_, res) => res.sendFile(_path.default.join(__dirname, "../build", "index.html")));

const httpServer = _http.default.createServer(app);

server.installSubscriptionHandlers(httpServer); // sync({ force: false })

_models.default.sequelize.authenticate().then(async res => {
  httpServer.listen(_config.default.PORT, () => {
    console.log(_chalk.default.green(`

        🚀 Server ready at http://localhost:${_config.default.PORT}

        🚀 GraphQL ready at http://localhost:${_config.default.PORT}${server.graphqlPath}

        🚀 Client ready at http://localhost:${3000}

    `));
  });
});