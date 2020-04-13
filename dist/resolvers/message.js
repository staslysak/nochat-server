"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../constants");

var _apolloServer = require("apollo-server");

var _default = {
  Subscription: {
    newMessage: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_constants.SUBS.NEW_MESSAGE), (payload, args) => payload.newMessage.chatId === args.chatId)
    },
    deleteMessage: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_constants.SUBS.DELETE_MESSAGE), (payload, args) => payload.deleteMessage.chatId === args.chatId)
    },
    userTyping: {
      subscribe: (0, _apolloServer.withFilter)((_, __, {
        pubsub
      }) => pubsub.asyncIterator(_constants.SUBS.USER_TYPING), (payload, args, {
        user
      }) => {
        console.log("userTyping", payload, args);
        return payload.chatId === args.chatId && payload.userTyping !== user.username;
      })
    }
  },
  Query: {
    messages: async (_, {
      chatId,
      offset
    }, {
      models
    }) => {
      return await models.message.findAll({
        where: {
          chatId
        },
        order: [["created_at", "DESC"]],
        limit: 20,
        offset
      }, {
        raw: true
      });
    }
  },
  Mutation: {
    createMessage: async (_, args, {
      models,
      user,
      pubsub
    }) => await models.message.create({ ...args,
      userId: user.id
    }, {
      raw: true
    }).then(async newMessage => {
      pubsub.publish(_constants.SUBS.NEW_MESSAGE, {
        newMessage
      });
      return true;
    }).catch(() => false),
    deleteMessage: async (_, {
      id
    }, {
      models,
      pubsub
    }) => await models.message.findByPk(id).then(deleteMessage => {
      return models.message.destroy({
        where: {
          id
        }
      }).then(() => {
        pubsub.publish(_constants.SUBS.DELETE_MESSAGE, {
          deleteMessage
        });
        return true;
      }).catch(() => false);
    }),
    readMessage: async (_, {
      id
    }, {
      models,
      pubsub
    }) => await models.message.update({
      unread: false
    }, {
      where: {
        id
      },
      returning: true,
      plain: true
    }).then(message => {
      return id;
    }),
    userTyping: async (_, {
      chatId,
      username
    }, {
      pubsub
    }) => {
      pubsub.publish(_constants.SUBS.USER_TYPING, {
        chatId,
        userTyping: username
      });
      return true;
    }
  }
};
exports.default = _default;