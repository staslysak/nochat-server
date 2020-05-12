import { withFilter } from "apollo-server";
import { SUBSCRIBTION_TYPES } from "../utils";

export default {
  Subscription: {
    directCreated: {
      subscribe: withFilter(
        (_, __, { pubsub }) =>
          pubsub.asyncIterator(SUBSCRIBTION_TYPES.DIRECT_CREATED),
        ({ directCreated }, _, { user }) =>
          [directCreated.receiverId, directCreated.senderId].includes(user.id)
      ),
    },
    directDeleted: {
      subscribe: withFilter(
        (_, __, { pubsub }) =>
          pubsub.asyncIterator(SUBSCRIBTION_TYPES.DIRECT_DELETED),
        ({ directDeleted }, _, { user }) =>
          [directDeleted.receiverId, directDeleted.senderId].includes(user.id)
      ),
    },
    messageCreated: {
      subscribe: withFilter(
        (_, __, { pubsub }) =>
          pubsub.asyncIterator(SUBSCRIBTION_TYPES.MESSAGE_CREATED),
        ({ messageCreated }, { chatIds }) =>
          chatIds.includes(messageCreated.chatId)
      ),
    },
    messageDeleted: {
      subscribe: withFilter(
        (_, __, { pubsub }) =>
          pubsub.asyncIterator(SUBSCRIBTION_TYPES.MESSAGE_DELETED),
        ({ messageDeleted }, { chatIds }) =>
          chatIds.includes(messageDeleted.chat.id)
      ),
    },
    typingUser: {
      subscribe: withFilter(
        (_, __, { pubsub }) =>
          pubsub.asyncIterator(SUBSCRIBTION_TYPES.TYPING_USER),
        (payload, args, { user }) => {
          return (
            payload.chatId === args.chatId &&
            payload.typingUser !== user.username
          );
        }
      ),
    },
    onlineUser: {
      subscribe: (_, __, { pubsub }) =>
        pubsub.asyncIterator(SUBSCRIBTION_TYPES.ONLINE_USER),
    },
  },
};
