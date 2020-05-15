"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _utils = require("../utils");

var _default = {
  Subscription: {
    directCreated: {
      subscribe: (0, _apolloServer.withFilter)((_, __, ctx) => ctx.pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.DIRECT_CREATED), (payload, _, ctx) => [payload.directCreated.receiverId, payload.directCreated.senderId].includes(ctx.user.id))
    },
    directDeleted: {
      subscribe: (0, _apolloServer.withFilter)((_, __, ctx) => ctx.pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.DIRECT_DELETED), (payload, _, ctx) => [payload.directDeleted.receiverId, payload.directDeleted.senderId].includes(ctx.user.id))
    },
    messageCreated: {
      subscribe: (0, _apolloServer.withFilter)((_, __, ctx) => ctx.pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.MESSAGE_CREATED), (payload, args) => {
        return args.chatIds.includes(payload.messageCreated.chatId);
      })
    },
    messageDeleted: {
      subscribe: (0, _apolloServer.withFilter)((_, __, ctx) => ctx.pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.MESSAGE_DELETED), (payload, args) => args.chatIds.includes(payload.messageDeleted.chat.id))
    },
    typingUser: {
      subscribe: (0, _apolloServer.withFilter)((_, __, ctx) => ctx.pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.TYPING_USER), (payload, args, ctx) => payload.chatId === args.chatId && payload.typingUser !== ctx.user.username)
    },
    onlineUser: {
      subscribe: (_, __, ctx) => ctx.pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.ONLINE_USER)
    }
  }
};
exports.default = _default;