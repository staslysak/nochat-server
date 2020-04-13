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
      return await models.user.findByPk(user.id, { raw: true });
    },
    users: (_, { username }, { models, op, user }) => {
      if (username) {
        return models.user.findAll(
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
    },
  },
  Mutation: {
    connect: async (_, __, { models, pubsub, user }) => {
      return await models.user
        .findByPk(user.id)
        .then((user) => {
          if (user) {
            user.update({
              online: true,
            });
          }
          return user;
        })
        .then((onlineUser) => {
          pubsub.publish(SUBS.ONLINE_USER, { onlineUser });
          return onlineUser;
        });
    },
    disconnect: async (_, __, { models, pubsub, user }) => {
      return await models.user
        .findByPk(user.id)
        .then((user) => {
          if (user) {
            user.update({
              online: false,
              lastSeen: Date.now(),
            });
          }
          return user;
        })
        .then((onlineUser) => {
          pubsub.publish(SUBS.ONLINE_USER, { onlineUser });
          return onlineUser;
        });
    },
    logout: () => true,
    login: async (_, { username, password }, { models }) => {
      return await tryLogin(username, password, models);
    },
    verifyUser: async (_, { secret }, { models }) => verifyUser(secret, models),
    register: async (_, args, { models }) => {
      return await models.user
        .create(args)
        .then(async (user) => {
          const token = createValidationToken(user.shortCode);
          await sendVerificationEmail(user.email, token);
          return true;
        })
        .catch((error) => {
          throw new UserInputError("Validation Error", {
            validationErrors: formatErrors(error, models),
          });
        });
    },
  },
};
