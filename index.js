import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./graphql";
import config from "./config";
import models from "./models";
import { logger } from "./utils";
import { addUser, addUserConnection } from "./middleware";
import path from "path";
import http from "http";
import { PubSub } from "apollo-server";

const pubsub = new PubSub();

const app = express();

app.use(cors("*"));
app.use(addUser);
app.use(express.static(path.join(__dirname, "build")));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      console.log("CONNECTION", connection.context.user);
      return connection.context;
    } else {
      // console.log("req", req.user);
      return {
        models,
        pubsub,
        user: req.user
      };
    }
  },
  subscriptions: {
    onConnect: async connectionParams => {
      const user = await addUserConnection(connectionParams.headers);
      return {
        ...connectionParams.headers,
        models,
        pubsub,
        user
      };

      // throw new Error("Missing auth token!");
    }
  },
  playground: true
});

server.applyMiddleware({ app });

app.get("/*", (_, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

models.sequelize.sync({ force: false }).then(async () => {
  httpServer.listen(config.PORT, () => {
    logger(
      `

        🚀  Server ready at http://localhost:${config.PORT}${server.graphqlPath}

        🚀  Client ready at http://localhost:${3000}
      
    `
    );
  });
});
