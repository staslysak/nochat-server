import express from "express";
import http from "http";
import chalk from "chalk";
import config from "./config";
import pubsub from "./pubsub";
import db from "./db/models";
import { initMiddleware } from "./middleware";
import initServer from "./server";

const app = express();
const initialContext = {
  db,
  op: db.op,
  pubsub,
};
const server = initServer(initialContext);

initMiddleware(app, db);

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
// sync({ force: false })
db.sequelize.authenticate().then(async () => {
  httpServer.listen(config.PORT, () => {
    console.log(
      chalk.blue(
        `
        Server ready at http://localhost:${config.PORT}

        GraphQL ready at http://localhost:${config.PORT}${server.graphqlPath}

        Client ready at http://localhost:${3000}
        `
      )
    );
  });
});
