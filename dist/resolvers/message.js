"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _permissions = _interopRequireDefault(require("../permissions"));

var _utils = require("../utils");

var _default = {
  Query: {
    messages: _permissions.default.createResolver(async (_, {
      chatId,
      offset
    }, {
      db
    }) => {
      return await db.message.findAll({
        where: {
          chatId
        },
        order: [["created_at", "DESC"]],
        limit: 20,
        offset
      }, {
        raw: true
      });
    })
  },
  Mutation: {
    createMessage: _permissions.default.createResolver(async (_, args, {
      db,
      user,
      pubsub
    }) => {
      return await db.message.create({ ...args,
        userId: user.id
      }, {
        raw: true
      }).then(messageCreated => {
        pubsub.publish(_utils.SUBSCRIBTION_TYPES.MESSAGE_CREATED, {
          messageCreated
        });
        return true;
      }).catch(() => false);
    }),
    deleteMessage: _permissions.default.createResolver(async (_, {
      id
    }, {
      db,
      pubsub
    }) => await db.message.findByPk(id).then(async message => {
      const chat = await db.direct.findOne({
        where: {
          id: message.chatId
        }
      });
      return await db.message.destroy({
        where: {
          id
        }
      }).then(() => pubsub.publish(_utils.SUBSCRIBTION_TYPES.MESSAGE_DELETED, {
        messageDeleted: {
          ids: id,
          chat
        }
      })).then(() => true).catch(() => false);
    })),
    readMessage: _permissions.default.createResolver(async (_, {
      id
    }, {
      db
    }) => await db.message.update({
      unread: false
    }, {
      where: {
        id
      },
      returning: true,
      plain: true
    }).then(message => id)),
    typeMessage: async (_, {
      chatId,
      username
    }, {
      pubsub
    }) => {
      pubsub.publish(_utils.SUBSCRIBTION_TYPES.TYPING_USER, {
        chatId,
        typingUser: username
      });
      return true;
    }
  }
};
exports.default = _default;