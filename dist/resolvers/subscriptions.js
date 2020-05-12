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
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.DIRECT_CREATED), ({
        directCreated
      }, _, {
        user
      }) => [directCreated.receiverId, directCreated.senderId].includes(user.id))
    },
    directDeleted: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.DIRECT_DELETED), ({
        directDeleted
      }, _, {
        user
      }) => [directDeleted.receiverId, directDeleted.senderId].includes(user.id))
    },
    messageCreated: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.MESSAGE_CREATED), ({
        messageCreated
      }, {
        chatIds
      }) => chatIds.includes(messageCreated.chatId))
    },
    messageDeleted: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.MESSAGE_DELETED), ({
        messageDeleted
      }, {
        chatIds
      }) => chatIds.includes(messageDeleted.chat.id))
    },
    typingUser: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.TYPING_USER), (payload, args, {
        user
      }) => {
        return payload.chatId === args.chatId && payload.typingUser !== user.username;
      })
    },
    onlineUser: {
      subscribe: (_, __, {
        pubsub
      }) => pubsub.asyncIterator(_utils.SUBSCRIBTION_TYPES.ONLINE_USER)
    }
  }
};
exports.default = _default;