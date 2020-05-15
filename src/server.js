import { ApolloServer, AuthenticationError } from "apollo-server-express";
import {
  connectUser,
  disconnectUser,
  verifyAccessToken,
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
        return {
          ...initialContext,
          ...connection.context,
        };
      } else {
        return {
          user: req.user,
          ...initialContext,
          // serverUrl: `${req.protocol}://${req.get("host")}`,
        };
      }
    },
    subscriptions: {
      onConnect: async (connectionParams) => {
        return await verifyAccessToken(extractTokens(connectionParams)).then(
          async ({ user }) => {
            if (user) {
              await connectUser({ ...initialContext, user });
              return { user };
            }

            throw new AuthenticationError("Invalid Token");
          }
        );
        // .catch(() => ({}));
      },
      onDisconnect: async (_, context) => {
        await context.initPromise.then(async (context) => {
          if (context?.user) {
            await disconnectUser({ ...initialContext, ...context });
          }
        });
      },
    },
    playground: process.env.NODE_ENV !== "production",
  });

export default initServer;
