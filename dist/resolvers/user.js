"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _apolloServer = require("apollo-server");

var _mailer = require("../mailer");

var _constants = require("../constants");

var _default = {
  Subscription: {
    onlineUser: {
      subscribe: (_, __, _ref) => {
        let {
          pubsub
        } = _ref;
        return pubsub.asyncIterator(_constants.SUBS.ONLINE_USER);
      }
    }
  },
  Query: {
    currentUser: async (_, __, _ref2) => {
      let {
        models,
        user
      } = _ref2;
      return await models.user.findByPk(user.id, {
        raw: true
      });
    },
    users: (_, _ref3, _ref4) => {
      let {
        username
      } = _ref3;
      let {
        models,
        op,
        user
      } = _ref4;

      if (username) {
        return models.user.findAll({
          where: {
            username: {
              [op.like]: "%".concat(username, "%")
            },
            id: {
              [op.ne]: user.id
            },
            status: _constants.STATUS.ACTIVE
          }
        }, {
          raw: true
        });
      }

      return [];
    }
  },
  Mutation: {
    connect: async (_, __, _ref5) => {
      let {
        models,
        pubsub,
        user
      } = _ref5;
      return await models.user.findByPk(user.id).then(user => {
        if (user) {
          user.update({
            online: true
          });
        }

        return user;
      }).then(onlineUser => {
        pubsub.publish(_constants.SUBS.ONLINE_USER, {
          onlineUser
        });
        return onlineUser;
      });
    },
    disconnect: async (_, __, _ref6) => {
      let {
        models,
        pubsub,
        user
      } = _ref6;
      return await models.user.findByPk(user.id).then(user => {
        if (user) {
          user.update({
            online: false,
            lastSeen: Date.now()
          });
        }

        return user;
      }).then(onlineUser => {
        pubsub.publish(_constants.SUBS.ONLINE_USER, {
          onlineUser
        });
        return onlineUser;
      });
    },
    logout: () => true,
    login: async (_, _ref7, _ref8) => {
      let {
        username,
        password
      } = _ref7;
      let {
        models
      } = _ref8;
      return await (0, _utils.tryLogin)(username, password, models);
    },
    verifyUser: async (_, _ref9, _ref10) => {
      let {
        secret
      } = _ref9;
      let {
        models
      } = _ref10;
      return (0, _utils.verifyUser)(secret, models);
    },
    register: async (_, args, _ref11) => {
      let {
        models
      } = _ref11;
      return await models.user.create(args).then(async user => {
        const token = (0, _utils.createValidationToken)(user.shortCode);
        await (0, _mailer.sendVerificationEmail)(user.email, token);
        return true;
      }).catch(error => {
        throw new _apolloServer.UserInputError("Validation Error", {
          validationErrors: (0, _utils.formatErrors)(error, models)
        });
      });
    }
  }
};
exports.default = _default;