"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _utils = require("./utils");

var _types = require("./types");

var _resolvers = require("./resolvers");

const initServer = initialContext => new _apolloServerExpress.ApolloServer({
  typeDefs: _types.typeDefs,
  resolvers: _resolvers.resolvers,
  context: async ({
    req,
    connection
  }) => {
    if (connection) {
      return { ...initialContext,
        ...connection.context
      };
    } else {
      return {
        user: req.user,
        ...initialContext // serverUrl: `${req.protocol}://${req.get("host")}`,

      };
    }
  },
  subscriptions: {
    onConnect: async connectionParams => {
      return await (0, _utils.verifyAccessToken)((0, _utils.extractTokens)(connectionParams)).then(async ({
        user
      }) => {
        if (user) {
          await (0, _utils.connectUser)({ ...initialContext,
            user
          });
          return {
            user
          };
        }

        throw new _apolloServerExpress.AuthenticationError("Invalid Token");
      }); // .catch(() => ({}));
    },
    onDisconnect: async (_, context) => {
      await context.initPromise.then(async context => {
        if (context === null || context === void 0 ? void 0 : context.user) {
          await (0, _utils.disconnectUser)({ ...initialContext,
            ...context
          });
        }
      });
    }
  },
  playground: process.env.NODE_ENV !== "production"
});

var _default = initServer;
exports.default = _default;