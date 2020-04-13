"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../constants");

var _apolloServer = require("apollo-server");

var _default = {
  Subscription: {
    newDirect: {
      subscribe: (0, _apolloServer.withFilter)((_, __, _ref) => {
        let {
          pubsub
        } = _ref;
        return pubsub.asyncIterator(_constants.SUBS.NEW_DIRECT);
      }, (payload, _, _ref2) => {
        let {
          user
        } = _ref2;
        return payload.newDirect.receiverId === user.id || payload.newDirect.senderId === user.id;
      })
    },
    deleteDirect: {
      subscribe: (0, _apolloServer.withFilter)((_, __, _ref3) => {
        let {
          pubsub
        } = _ref3;
        return pubsub.asyncIterator(_constants.SUBS.DELETE_DIRECT);
      }, (payload, _, _ref4) => {
        let {
          user
        } = _ref4;
        return payload.deleteDirect.receiverId === user.id || payload.deleteDirect.senderId === user.id;
      })
    }
  },
  Direct: {
    user: async (_ref5, __, _ref6) => {
      let {
        receiverId,
        senderId
      } = _ref5;
      let {
        models,
        user: _user
      } = _ref6;
      const id = receiverId === _user.id ? senderId : receiverId;
      return await models.user.findByPk(id, {
        raw: true
      });
    },
    lastMessage: async (_ref7, __, _ref8) => {
      let {
        id
      } = _ref7;
      let {
        models
      } = _ref8;
      return (await models.message.findOne({
        where: {
          chatId: id
        },
        order: [["created_at", "DESC"]]
      }, {
        raw: true
      })) || {};
    },
    unread: async (_ref9, __, _ref10) => {
      let {
        id
      } = _ref9;
      let {
        models,
        op,
        user
      } = _ref10;
      return await models.message.count({
        where: {
          chatId: id,
          unread: true,
          userId: {
            [op.ne]: user.id
          }
        }
      }, {
        raw: true
      });
    }
  },
  Query: {
    directLastMessage: async (_, _ref11, _ref12) => {
      let {
        chatId
      } = _ref11;
      let {
        models
      } = _ref12;
      return await models.message.findOne({
        where: {
          chatId
        },
        order: [["created_at", "DESC"]]
      }, {
        raw: true
      });
    },
    currentDirect: async (_, _ref13, _ref14) => {
      let {
        userId
      } = _ref13;
      let {
        models,
        op,
        user
      } = _ref14;
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
    directs: async (_, __, _ref15) => {
      let {
        models,
        op,
        user
      } = _ref15;
      return await models.direct.findAll({
        where: {
          [op.or]: [{
            receiverId: user.id
          }, {
            senderId: user.id
          }]
        }
      }, {
        raw: true
      });
    }
  },
  Mutation: {
    createDirect: async (_, _ref16, _ref17) => {
      let {
        userId,
        text
      } = _ref16;
      let {
        models,
        op,
        user,
        pubsub
      } = _ref17;
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
        pubsub.publish(_constants.SUBS.NEW_DIRECT, {
          newDirect
        });
        return newDirect;
      });
    },
    deleteDirect: async (_, _ref18, _ref19) => {
      let {
        id
      } = _ref18;
      let {
        models,
        pubsub
      } = _ref19;
      return await models.direct.findByPk(id).then(async deleteDirect => await models.direct.destroy({
        where: {
          id
        }
      }).then(() => {
        pubsub.publish(_constants.SUBS.DELETE_DIRECT, {
          deleteDirect
        });
        return true;
      }).catch(() => false));
    }
  }
};
exports.default = _default;