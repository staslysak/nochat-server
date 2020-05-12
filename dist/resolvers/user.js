"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _apolloServer = require("apollo-server");

var _mailer = require("../mailer");

var _permissions = _interopRequireDefault(require("../permissions"));

var _default = {
  Query: {
    currentUser: _permissions.default.createResolver(async (_, __, {
      db,
      user
    }) => {
      return await db.user.findByPk(user.id, {
        raw: true
      });
    }),
    users: _permissions.default.createResolver((_, {
      username
    }, {
      db,
      op,
      user
    }) => {
      if (username) {
        return db.user.findAll({
          where: {
            username: {
              [op.like]: `%${username}%`
            },
            id: {
              [op.ne]: user.id
            },
            status: _utils.STATUS.ACTIVE
          }
        }, {
          raw: true
        });
      }

      return [];
    }),
    refreshTokens: async (_, {
      refreshToken
    }, {
      db
    }) => {
      const tokens = await (0, _utils.refreshTokens)(refreshToken, db);
      return tokens;
    }
  },
  Mutation: {
    logout: () => true,
    login: async (_, {
      username,
      password
    }, {
      db
    }) => {
      return await (0, _utils.tryLogin)(username, password, db);
    },
    verifyUser: async (_, {
      secret
    }, {
      db
    }) => (0, _utils.verifyUser)(secret, db),
    register: async (_, args, {
      db
    }) => {
      return await db.user.create(args).then(async user => {
        const token = (0, _utils.createValidationToken)(user.shortCode);
        await (0, _mailer.sendVerificationEmail)(user.email, token);
        return true;
      }).catch(error => {
        throw new _apolloServer.UserInputError("Validation Error", {
          validationErrors: (0, _utils.formatErrors)(error, db)
        });
      });
    }
  }
};
exports.default = _default;