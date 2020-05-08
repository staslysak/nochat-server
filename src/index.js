import express from "express";
import http from "http";
import chalk from "chalk";
import config from "./config";
import pubsub from "./pubsub";
import models from "./db/models";
import { initMiddleware } from "./middleware";
import initServer from "./server";

const app = express();
const initialContext = {
  models,
  op: models.op,
  pubsub,
};
const server = initServer(initialContext);

initMiddleware(app, models);

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
