"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _permissions = _interopRequireDefault(require("../permissions"));

var _utils = require("../utils");

var _default = {
  Direct: {
    user: async ({
      receiverId,
      senderId
    }, __, {
      db,
      user
    }) => {
      const id = receiverId === user.id ? senderId : receiverId;
      return await db.user.findByPk(id, {
        raw: true
      });
    },
    lastMessage: async ({
      id
    }, __, {
      db
    }) => await db.message.findOne({
      where: {
        chatId: id
      },
      order: [["created_at", "DESC"]]
    }, {
      raw: true
    }),
    unread: async ({
      id
    }, __, {
      db,
      op,
      user
    }) => await db.message.count({
      where: {
        chatId: id,
        unread: true,
        userId: {
          [op.ne]: user.id
        }
      }
    }, {
      raw: true
    })
  },
  Query: {
    currentDirect: _permissions.default.createResolver(async (_, {
      userId
    }, {
      db,
      op,
      user
    }) => {
      const recipient = await db.user.findByPk(userId, {
        raw: true
      });
      return await db.direct.findOne({
        where: {
          [op.or]: [{
            receiverId: user.id,
            senderId: userId
          }, {
            receiverId: userId,
            senderId: user.id
          }]
        }
      }, {
        raw: true
      }).then(direct => ({
        direct: direct.dataValues,
        recipient
      })).catch(() => ({
        recipient
      }));
    }),
    direct: _permissions.default.createResolver(async (_, {
      id
    }, {
      db,
      op,
      user
    }) => {
      return await db.direct.findOne({
        where: {
          id,
          [op.or]: [{
            receiverId: user.id
          }, {
            senderId: user.id
          }]
        }
      }, {
        raw: true
      });
    }),
    directs: _permissions.default.createResolver(async (_, __, {
      db,
      op,
      user
    }) => await db.direct.findAll({
      where: {
        [op.or]: [{
          receiverId: user.id
        }, {
          senderId: user.id
        }]
      }
    }, {
      raw: true
    }))
  },
  Mutation: {
    createDirect: _permissions.default.createResolver(async (_, {
      userId,
      text
    }, {
      db,
      op,
      user,
      pubsub
    }) => {
      const exists = await db.direct.findOne({
        where: {
          [op.or]: [{
            receiverId: user.id,
            senderId: userId
          }, {
            senderId: user.id,
            receiverId: userId
          }]
        }
      });

      if (exists) {
        return exists;
      }

      return await db.direct.create({
        receiverId: user.id,
        senderId: userId
      }).then(async directCreated => {
        await db.message.create({
          userId: user.id,
          chatId: directCreated.id,
          text
        });
        pubsub.publish(_utils.SUBSCRIBTION_TYPES.DIRECT_CREATED, {
          directCreated
        });
        return directCreated;
      });
    }),
    deleteDirect: _permissions.default.createResolver(async (_, {
      id
    }, {
      db,
      pubsub
    }) => await db.direct.findByPk(id).then(async directDeleted => {
      return await db.direct.destroy({
        where: {
          id
        }
      }).then(() => {
        pubsub.publish(_utils.SUBSCRIBTION_TYPES.DIRECT_DELETED, {
          directDeleted
        });
        return true;
      }).catch(() => false);
    }))
  }
};
exports.default = _default;