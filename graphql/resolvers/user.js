import {
  formatErrors,
  tryLogin,
  verifyUser,
  createValidationToken
} from "../../utils";
import { UserInputError } from "apollo-server";
import { sendVerificationEmail } from "../../mailer";
import { STATUS } from "./../../constants";

export default {
  Query: {
    user: async (_, __, { models, user = { id: 1 } }) => {
      return await models.User.findOne(
        { where: { id: user.id } },
        { raw: true }
      );
    },
    users: (_, { username }, { models, user }) => {
      const query = {};

      if (username) {
        query.where = {
          username: { [models.Sequelize.Op.like]: `%${username}%` },
          id: { [models.Sequelize.Op.ne]: user.id },
          status: STATUS.ACTIVE
        };
      }

      return models.User.findAll(query, { raw: true });
    }
  },
  Mutation: {
    createUser: async (_, args, { models }) => {
      return await models.User.create(args)
        .then(async user => {
          const token = await createValidationToken(user.shortCode);
          await sendVerificationEmail(user.email, token);
          return true;
        })
        .catch(error => {
          throw new UserInputError("Validation Error", {
            validationErrors: formatErrors(error, models)
          });
        });
    },
    login: async (_, { username, password }, { models }) =>
      await tryLogin(username, password, models),
    logout: () => true,
    verifyUser: async (_, { secret }, { models }) => verifyUser(secret, models)
  }
};
