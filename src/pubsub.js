import { PubSub } from "apollo-server";
import { RedisPubSub } from "graphql-redis-subscriptions";
import config from "./config";

const options = {
  connection: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    retryStrategy: (times) => {
      // reconnect after
      return Math.min(times * 50, 2000);
    },
  },
};

// export default new RedisPubSub(options);

export default new PubSub();
