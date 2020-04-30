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
  Query: {
    currentUser: async (_, __, {
      models,
      user
    }) => {
      return await models.user.findByPk(user.id, {
        raw: true
      });
    },
    users: (_, {
      username
    }, {
      models,
      op,
      user
    }) => {
      if (username) {
        return models.user.findAll({
          where: {
            username: {
              [op.like]: `%${username}%`
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
    logout: () => true,
    login: async (_, {
      username,
      password
    }, {
      models
    }) => {
      return await (0, _utils.tryLogin)(username, password, models);
    },
    verifyUser: async (_, {
      secret
    }, {
      models
    }) => (0, _utils.verifyUser)(secret, models),
    register: async (_, args, {
      models
    }) => {
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