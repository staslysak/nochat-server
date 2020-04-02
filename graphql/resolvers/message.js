import { SUBS } from "../../constants";
import { withFilter } from "apollo-server";

export default {
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(SUBS.NEW_MESSAGE),
        (payload, args) => payload.newMessage.chatId === args.chatId
      )
    }
  },
  Query: {
    deleteMessage: async (_, { id }, { models }) =>
      await models.Message.destroy({ where: { id } })
        .then(() => true)
        .catch(() => false)
  },
  Mutation: {
    createMessage: async (_, args, { models, user, pubsub }) =>
      await models.Message.create({ ...args, userId: user.id }, { raw: true })
        .then(async newMessage => {
          pubsub.publish(SUBS.NEW_MESSAGE, { newMessage });
          return true;
        })
        .catch(error => {
          return false;
        })
  }
};
