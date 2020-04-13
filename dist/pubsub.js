"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _graphqlRedisSubscriptions = require("graphql-redis-subscriptions");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const options = {
  connection: {
    host: _config.default.REDIS_HOST,
    port: _config.default.REDIS_PORT,
    retryStrategy: times => {
      // reconnect after
      return Math.min(times * 50, 2000);
    }
  }
}; // export default new RedisPubSub(options);

var _default = new _apolloServer.PubSub();

exports.default = _default;