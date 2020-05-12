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
    currentUser: reqAuth.createResolver(async (_, __, { db, user }) => {
      return await db.user.findByPk(user.id, { raw: true });
    }),
    users: reqAuth.createResolver((_, { username }, { db, op, user }) => {
      if (username) {
        return db.user.findAll(
          {
            where: {
              username: { [op.like]: `%${username}%` },
              id: { [op.ne]: user.id },
              status: STATUS.ACTIVE,
            },
          },
          { raw: true }
        );
      }

      return [];
    }),
    refreshTokens: async (_, { refreshToken }, { db }) => {
      const tokens = await refreshTokens(refreshToken, db);
      return tokens;
    },
  },
  Mutation: {
    logout: () => true,
    login: async (_, { username, password }, { db }) => {
      return await tryLogin(username, password, db);
    },
    verifyUser: async (_, { secret }, { db }) => {
      return await verifyAccessToken(secret)
        .then(async ({ secret }) => {
          const user = await db.user.update(
            { status: STATUS.ACTIVE },
            {
              where: { shortCode: secret },
              returning: true,
              plain: true,
            }
          );

          const tokens = await createTokens(user[1]);

          return {
            user: user[1],
            ...tokens,
          };
        })
        .catch(() => {
          return null;
        });
    },
    register: async (_, args, { db }) => {
      return await db.user
        .create(args)
        .then(async (user) => {
          const token = createVerificationToken(user.shortCode);
          await sendVerificationEmail(user.email, token);
          return true;
        })
        .catch((error) => {
          throw new UserInputError("Validation Error", {
            validationErrors: formatErrors(error, db),
          });
        });
    },
  },
};
