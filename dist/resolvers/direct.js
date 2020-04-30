"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../constants");

var _default = {
  Direct: {
    user: async ({
      receiverId,
      senderId
    }, __, {
      models,
      user
    }) => {
      const id = receiverId === user.id ? senderId : receiverId;
      return await models.user.findByPk(id, {
        raw: true
      });
    },
    lastMessage: async ({
      id
    }, __, {
      models
    }) => (await models.message.findOne({
      where: {
        chatId: id
      },
      order: [["created_at", "DESC"]]
    }, {
      raw: true
    })) || {},
    unread: async ({
      id
    }, __, {
      models,
      op,
      user
    }) => await models.message.count({
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
    directLastMessage: async (_, {
      chatId
    }, {
      models
    }) => await models.message.findOne({
      where: {
        chatId
      },
      order: [["created_at", "DESC"]]
    }, {
      raw: true
    }),
    currentDirect: async (_, {
      userId
    }, {
      models,
      op,
      user
    }) => {
      const recipient = await models.user.findByPk(userId, {
        raw: true
      });
      return await models.direct.findOne({
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
    },
    directs: async (_, __, {
      models,
      op,
      user
    }) => await models.direct.findAll({
      where: {
        [op.or]: [{
          receiverId: user.id
        }, {
          senderId: user.id
        }]
      }
    }, {
      raw: true
    })
  },
  Mutation: {
    createDirect: async (_, {
      userId,
      text
    }, {
      models,
      op,
      user,
      pubsub
    }) => {
      const exists = await models.direct.findOne({
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

      return await models.direct.create({
        receiverId: user.id,
        senderId: userId
      }).then(async newDirect => {
        await models.message.create({
          userId: user.id,
          chatId: newDirect.id,
          text
        });
        pubsub.publish(_constants.subTypes.NEW_DIRECT, {
          newDirect
        });
        return newDirect;
      });
    },
    deleteDirect: async (_, {
      id
    }, {
      models,
      pubsub
    }) => await models.direct.findByPk(id).then(async deleteDirect => await models.direct.destroy({
      where: {
        id
      }
    }).then(() => {
      pubsub.publish(_constants.subTypes.DELETE_DIRECT, {
        deleteDirect
      });
      return true;
    }).catch(() => false))
  }
};
exports.default = _default;