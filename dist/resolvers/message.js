"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _constants = require("../constants");

var _apolloServer = require("apollo-server");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  Subscription: {
    newMessage: {
      subscribe: (0, _apolloServer.withFilter)((_, __, _ref) => {
        let {
          pubsub
        } = _ref;
        return pubsub.asyncIterator(_constants.SUBS.NEW_MESSAGE);
      }, (payload, args) => payload.newMessage.chatId === args.chatId)
    },
    deleteMessage: {
      subscribe: (0, _apolloServer.withFilter)((_, __, _ref2) => {
        let {
          pubsub
        } = _ref2;
        return pubsub.asyncIterator(_constants.SUBS.DELETE_MESSAGE);
      }, (payload, args) => payload.deleteMessage.chatId === args.chatId)
    },
    userTyping: {
      subscribe: (0, _apolloServer.withFilter)((_, __, _ref3) => {
        let {
          pubsub
        } = _ref3;
        return pubsub.asyncIterator(_constants.SUBS.USER_TYPING);
      }, (payload, args, _ref4) => {
        let {
          user
        } = _ref4;
        console.log("userTyping", payload, args);
        return payload.chatId === args.chatId && payload.userTyping !== user.username;
      })
    }
  },
  Query: {
    messages: async (_, _ref5, _ref6) => {
      let {
        chatId,
        offset
      } = _ref5;
      let {
        models
      } = _ref6;
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
    createMessage: async (_, args, _ref7) => {
      let {
        models,
        user,
        pubsub
      } = _ref7;
      return await models.message.create(_objectSpread({}, args, {
        userId: user.id
      }), {
        raw: true
      }).then(async newMessage => {
        pubsub.publish(_constants.SUBS.NEW_MESSAGE, {
          newMessage
        });
        return true;
      }).catch(() => false);
    },
    deleteMessage: async (_, _ref8, _ref9) => {
      let {
        id
      } = _ref8;
      let {
        models,
        pubsub
      } = _ref9;
      return await models.message.findByPk(id).then(deleteMessage => {
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
      });
    },
    readMessage: async (_, _ref10, _ref11) => {
      let {
        id
      } = _ref10;
      let {
        models,
        pubsub
      } = _ref11;
      return await models.message.update({
        unread: false
      }, {
        where: {
          id
        },
        returning: true,
        plain: true
      }).then(message => {
        return id;
      });
    },
    userTyping: async (_, _ref12, _ref13) => {
      let {
        chatId,
        username
      } = _ref12;
      let {
        pubsub
      } = _ref13;
      pubsub.publish(_constants.SUBS.USER_TYPING, {
        chatId,
        userTyping: username
      });
      return true;
    }
  }
};
exports.default = _default;