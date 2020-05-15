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
    }, ctx) => {
      return await ctx.db.message.findAll({
        where: {
          chatId
        },
        offset,
        limit: 20,
        order: [["created_at", "DESC"]]
      });
    })
  },
  Mutation: {
    createMessage: _permissions.default.createResolver(async (_, args, ctx) => {
      return await ctx.db.message.create({ ...args,
        userId: ctx.user.id
      }).then(messageCreated => {
        ctx.pubsub.publish(_utils.SUBSCRIBTION_TYPES.MESSAGE_CREATED, {
          messageCreated
        });
        return true;
      }).catch(() => false);
    }),
    deleteMessage: _permissions.default.createResolver(async (_, {
      id
    }, ctx) => await ctx.db.message.findByPk(id).then(async message => {
      const chat = await ctx.db.direct.findOne({
        where: {
          id: message.chatId
        }
      });
      return await ctx.db.message.destroy({
        where: {
          id
        }
      }).then(() => {
        ctx.pubsub.publish(_utils.SUBSCRIBTION_TYPES.MESSAGE_DELETED, {
          messageDeleted: {
            ids: id,
            chat
          }
        });
      }).then(() => true).catch(() => false);
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