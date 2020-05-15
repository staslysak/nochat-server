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
    self: _permissions.default.createResolver(async (_, __, ctx) => {
      return await ctx.db.user.findByPk(ctx.user.id);
    }),
    user: _permissions.default.createResolver(async (_, args, ctx) => {
      const user = await ctx.db.user.findByPk(args.id);
      return user;
    }),
    users: _permissions.default.createResolver((_, args, ctx) => {
      if (args.username) {
        return ctx.db.user.findAll({
          where: {
            username: {
              [ctx.op.like]: `%${args.username}%`
            },
            id: {
              [ctx.op.ne]: ctx.user.id
            },
            status: _utils.STATUS.ACTIVE
          }
        });
      }

      return [];
    }),
    refreshTokens: async (_, args, ctx) => {
      const tokens = await (0, _utils.refreshTokens)(args.refreshToken, ctx.db);
      return tokens;
    }
  },
  Mutation: {
    logout: () => true,
    login: async (_, args, ctx) => {
      return await (0, _utils.tryLogin)(args.username, args.password, ctx.db);
    },
    verifyUser: async (_, args, ctx) => {
      return await (0, _utils.verifyAccessToken)(args.secret).then(async ({
        secret
      }) => {
        const [__, user] = await ctx.db.user.update({
          status: _utils.STATUS.ACTIVE
        }, {
          where: {
            shortCode: secret
          },
          returning: true,
          plain: true
        });
        const tokens = await (0, _utils.createTokens)(user);
        return {
          user,
          ...tokens
        };
      }).catch(() => null);
    },
    register: async (_, args, ctx) => {
      return await ctx.db.user.create(args).then(async user => {
        const token = (0, _utils.createVerificationToken)(user.shortCode);
        await (0, _mailer.sendVerificationEmail)(user.email, token);
        return true;
      }).catch(error => {
        throw new _apolloServer.UserInputError("Validation Error", {
          validationErrors: (0, _utils.formatErrors)(error, ctx.db)
        });
      });
    }
  }
};
exports.default = _default;