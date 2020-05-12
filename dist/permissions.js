"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

const createResolver = resolver => {
  const baseResolver = resolver;

  baseResolver.createResolver = childResolver => {
    const newResolver = async (root, args, context, info) => {
      await resolver(root, args, context, info);
      return childResolver(root, args, context, info);
    };

    return createResolver(newResolver);
  };

  return baseResolver;
};

var _default = createResolver((_, __, {
  user
}) => {
  if (!(user === null || user === void 0 ? void 0 : user.id)) {
    throw new _apolloServer.AuthenticationError("Unauthorized Permission");
  }
});

exports.default = _default;