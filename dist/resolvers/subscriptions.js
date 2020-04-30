"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _constants = require("../constants");

var _default = {
  Subscription: {
    newDirect: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_constants.subTypes.NEW_DIRECT), (payload, _, {
        user
      }) => payload.newDirect.receiverId === user.id || payload.newDirect.senderId === user.id)
    },
    deleteDirect: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_constants.subTypes.DELETE_DIRECT), (payload, _, {
        user
      }) => payload.deleteDirect.receiverId === user.id || payload.deleteDirect.senderId === user.id)
    },
    newMessage: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_constants.subTypes.NEW_MESSAGE), (payload, args) => payload.newMessage.chatId === args.chatId)
    },
    deleteMessage: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_constants.subTypes.DELETE_MESSAGE), (payload, args) => payload.deleteMessage.chatId === args.chatId)
    },
    userTyping: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_constants.subTypes.USER_TYPING), (payload, args, {
        user
      }) => {
        return payload.chatId === args.chatId && payload.userTyping !== user.username;
      })
    },
    onlineUser: {
      subscribe: (_, __, {
        pubsub
      }) => pubsub.asyncIterator(_constants.subTypes.ONLINE_USER)
    }
  }
};
exports.default = _default;