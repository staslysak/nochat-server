import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import chalk from "chalk";
import { ApolloServer } from "apollo-server-express";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import config from "./config";
import pubsub from "./pubsub";
import models from "./db/models";
import { addUser, addUserConnection } from "./middleware";
import { onConnect, onDisconnect } from "./utils/auth";

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./types")), {
  all: true,
});

const app = express();

app.use(cors("*"));
app.use(addUser(models));
app.use(express.static(path.join(__dirname, "../build")));

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
          const user = await addUserConnection(connectionParams, models);
          if (user) {
            await onConnect({ models, pubsub, user });
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
        await onDisconnect(initialContext);
      }
    },
  },
  playground: process.env.NODE_ENV !== "production",
});

server.applyMiddleware({ app });

app.get("/*", (_, res) =>
  res.sendFile(path.join(__dirname, "../build", "index.html"))
);

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
// sync({ force: false })
models.sequelize.authenticate().then(async (res) => {
  httpServer.listen(config.PORT, () => {
    console.log(
      chalk.green(
        `

        🚀 Server ready at http://localhost:${config.PORT}

        🚀 GraphQL ready at http://localhost:${config.PORT}${server.graphqlPath}

        🚀 Client ready at http://localhost:${3000}

    `
      )
    );
  });
});
