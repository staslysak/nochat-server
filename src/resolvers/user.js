import {
  STATUS,
  formatErrors,
  tryLogin,
  createVerificationToken,
  refreshTokens,
  verifyAccessToken,
  createTokens,
} from "../utils";
import { UserInputError } from "apollo-server";
import { sendVerificationEmail } from "../mailer";
import reqAuth from "../permissions";

export default {
  Query: {
    self: reqAuth.createResolver(async (_, __, ctx) => {
      return await ctx.db.user.findByPk(ctx.user.id);
    }),
    user: reqAuth.createResolver(async (_, args, ctx) => {
      const user = await ctx.db.user.findByPk(args.id);
      return user;
    }),
    users: reqAuth.createResolver((_, args, ctx) => {
      if (args.username) {
        return ctx.db.user.findAll({
          where: {
            username: { [ctx.op.like]: `%${args.username}%` },
            id: { [ctx.op.ne]: ctx.user.id },
            status: STATUS.ACTIVE,
          },
        });
      }

      return [];
    }),
    refreshTokens: async (_, args, ctx) => {
      const tokens = await refreshTokens(args.refreshToken, ctx.db);
      return tokens;
    },
  },
  Mutation: {
    logout: () => true,
    login: async (_, args, ctx) => {
      return await tryLogin(args.username, args.password, ctx.db);
    },
    verifyUser: async (_, args, ctx) => {
      return await verifyAccessToken(args.secret)
        .then(async ({ secret }) => {
          const [__, user] = await ctx.db.user.update(
            { status: STATUS.ACTIVE },
            {
              where: { shortCode: secret },
              returning: true,
              plain: true,
            }
          );

          const tokens = await createTokens(user);

          return { user, ...tokens };
        })
        .catch(() => null);
    },
    register: async (_, args, ctx) => {
      return await ctx.db.user
        .create(args)
        .then(async (user) => {
          const token = createVerificationToken(user.shortCode);
          await sendVerificationEmail(user.email, token);
          return true;
        })
        .catch((error) => {
          throw new UserInputError("Validation Error", {
            validationErrors: formatErrors(error, ctx.db),
          });
        });
    },
  },
};
