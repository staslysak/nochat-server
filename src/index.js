import express from "express";
import http from "http";
import chalk from "chalk";
import { ApolloServer } from "apollo-server-express";
import config from "./config";
import pubsub from "./pubsub";
import models from "./db/models";
import { initMiddleware } from "./middleware";
import {
  connectUser,
  disconnectUser,
  verifyTokenConnection,
  extractTokens,
} from "./utils";
import { typeDefs } from "./types";
import { resolvers } from "./resolvers";

const app = express();
const initialContext = {
  models,
  op: models.op,
  pubsub,
};

initMiddleware(app, models);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return connection.context;
    } else {
      return {
        user: req.user,
        ...initialContext,
        serverUrl: `${req.protocol}://${req.get("host")}`,
      };
    }
  },
  subscriptions: {
    onConnect: async (connectionParams) => {
      try {
        const tokens = extractTokens(connectionParams);
        if (tokens) {
          const user = await verifyTokenConnection(tokens, models);

          if (user) {
            await connectUser({ ...initialContext, user });
          }

          return {
            user,
            ...initialContext,
          };
        }
      } catch (error) {
        throw new Error("Unauthorized!");
      }
    },
    onDisconnect: async (_, context) => {
      const initialContext = await context.initPromise;

      if (initialContext && initialContext.user) {
        await disconnectUser(initialContext);
      }
    },
  },
  playground: process.env.NODE_ENV !== "production",
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
// sync({ force: false })
models.sequelize.sync().then(async () => {
  httpServer.listen(config.PORT, () => {
    console.log(
      chalk.green(
        `
        Server ready at http://localhost:${config.PORT}

        GraphQL ready at http://localhost:${config.PORT}${server.graphqlPath}

        Client ready at http://localhost:${3000}
    `
      )
    );
  });
});
