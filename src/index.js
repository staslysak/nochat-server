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
} from "./utils/auth";
import { typeDefs } from "./types";
import { resolvers } from "./resolvers";

const app = express();

initMiddleware(app, models);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return connection.context;
    } else {
      const serverUrl = `${req.protocol}://${req.get("host")}`;
      return {
        models,
        op: models.Sequelize.Op,
        pubsub,
        user: req.user,
        serverUrl,
      };
    }
  },
  subscriptions: {
    onConnect: async (connectionParams) => {
      try {
        if (
          connectionParams["x-token"] &&
          connectionParams["x-refresh-token"]
        ) {
          const user = await verifyTokenConnection(connectionParams, models);

          if (user) {
            await connectUser({ models, pubsub, user });
          }

          return {
            models,
            op: models.Sequelize.Op,
            pubsub,
            user,
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
