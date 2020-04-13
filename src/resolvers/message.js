import { SUBS } from "../constants";
import { withFilter } from "apollo-server";

export default {
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(SUBS.NEW_MESSAGE),
        (payload, args) => payload.newMessage.chatId === args.chatId
      ),
    },
    deleteMessage: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(SUBS.DELETE_MESSAGE),
        (payload, args) => payload.deleteMessage.chatId === args.chatId
      ),
    },
    userTyping: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(SUBS.USER_TYPING),
        (payload, args, { user }) => {
          console.log("userTyping", payload, args);
          return (
            payload.chatId === args.chatId &&
            payload.userTyping !== user.username
          );
        }
      ),
    },
  },
  Query: {
    messages: async (_, { chatId, offset }, { models }) => {
      return await models.message.findAll(
        {
          where: { chatId },
          order: [["created_at", "DESC"]],
          limit: 20,
          offset,
        },
        { raw: true }
      );
    },
  },
  Mutation: {
    createMessage: async (_, args, { models, user, pubsub }) =>
      await models.message
        .create({ ...args, userId: user.id }, { raw: true })
        .then(async (newMessage) => {
          pubsub.publish(SUBS.NEW_MESSAGE, { newMessage });
          return true;
        })
        .catch(() => false),
    deleteMessage: async (_, { id }, { models, pubsub }) =>
      await models.message.findByPk(id).then((deleteMessage) => {
        return models.message
          .destroy({ where: { id } })
          .then(() => {
            pubsub.publish(SUBS.DELETE_MESSAGE, { deleteMessage });
            return true;
          })
          .catch(() => false);
      }),
    readMessage: async (_, { id }, { models, pubsub }) =>
      await models.message
        .update(
          { unread: false },
          { where: { id }, returning: true, plain: true }
        )
        .then((message) => {
          return id;
        }),
    userTyping: async (_, { chatId, username }, { pubsub }) => {
      pubsub.publish(SUBS.USER_TYPING, {
        chatId,
        userTyping: username,
      });
      return true;
    },
  },
};
