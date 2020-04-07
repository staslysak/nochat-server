import {
  formatErrors,
  tryLogin,
  verifyUser,
  createValidationToken,
} from "../utils";
import { UserInputError } from "apollo-server";
import { sendVerificationEmail } from "../mailer";
import { STATUS, SUBS } from "../constants";

export default {
  Subscription: {
    onlineUser: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(SUBS.ONLINE_USER),
    },
  },
  Query: {
    currentUser: async (_, __, { models, user }) => {
      return await models.User.findOne(
        { where: { id: user.id } },
        { raw: true }
      );
    },
    users: (_, { username }, { models, user }) => {
      if (username) {
        return models.User.findAll(
          {
            where: {
              username: { $like: `%${username}%` },
              id: { $ne: user.id },
              status: STATUS.ACTIVE,
            },
          },
          { raw: true }
        );
      }

      return [];
    },
    onlineUsers: async (_, __, { models }) => {
      return await models.User.findAll(
        {
          where: {
            online: true,
            status: STATUS.ACTIVE,
          },
        },
        { raw: true }
      );
    },
  },
  Mutation: {
    setOnline: async (_, __, { models, pubsub, user }) => {
      return await models.User.update(
        { online: true },
        {
          where: { id: user.id },
          returning: true,
          plain: true,
        }
      ).then((user) => {
        pubsub.publish(SUBS.ONLINE_USER, { onlineUser: user[1] });
        return user[1];
      });
    },
    setOffline: async (_, __, { models, pubsub, user }) => {
      return await models.User.update(
        { online: false, lastSeen: Date.now() },
        {
          where: { id: user.id },
          returning: true,
          plain: true,
        }
      ).then((user) => {
        pubsub.publish(SUBS.ONLINE_USER, { onlineUser: user[1] });
        return user[1];
      });
    },
    logout: () => true,
    login: async (_, { username, password }, { models }) => {
      return await tryLogin(username, password, models);
    },
    verifyUser: async (_, { secret }, { models }) => verifyUser(secret, models),
    createUser: async (_, args, { models }) =>
      await models.User.create(args)
        .then(async (user) => {
          const token = await createValidationToken(user.shortCode);
          await sendVerificationEmail(user.email, token);
          return true;
        })
        .catch((error) => {
          throw new UserInputError("Validation Error", {
            validationErrors: formatErrors(error, models),
          });
        }),
  },
};
