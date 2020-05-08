import { ApolloServer } from "apollo-server-express";
import {
  connectUser,
  disconnectUser,
  verifyTokenConnection,
  extractTokens,
} from "./utils";
import { typeDefs } from "./types";
import { resolvers } from "./resolvers";

const initServer = (initialContext) =>
  new ApolloServer({
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
            const user = await verifyTokenConnection(
              tokens,
              initialContext.models
            );

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

export default initServer;
