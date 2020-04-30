import { withFilter } from "apollo-server";
import { subTypes } from "../constants";

export default {
  Subscription: {
    newDirect: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(subTypes.NEW_DIRECT),
        (payload, _, { user }) =>
          payload.newDirect.receiverId === user.id ||
          payload.newDirect.senderId === user.id
      ),
    },
    deleteDirect: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(subTypes.DELETE_DIRECT),
        (payload, _, { user }) =>
          payload.deleteDirect.receiverId === user.id ||
          payload.deleteDirect.senderId === user.id
      ),
    },
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(subTypes.NEW_MESSAGE),
        (payload, args) => payload.newMessage.chatId === args.chatId
      ),
    },
    deleteMessage: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(subTypes.DELETE_MESSAGE),
        (payload, args) => payload.deleteMessage.chatId === args.chatId
      ),
    },
    userTyping: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(subTypes.USER_TYPING),
        (payload, args, { user }) => {
          return (
            payload.chatId === args.chatId &&
            payload.userTyping !== user.username
          );
        }
      ),
    },
    onlineUser: {
      subscribe: (_, __, { pubsub }) =>
        pubsub.asyncIterator(subTypes.ONLINE_USER),
    },
  },
};
