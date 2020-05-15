import { withFilter } from "apollo-server";
import { SUBSCRIBTION_TYPES } from "../utils";

export default {
  Subscription: {
    directCreated: {
      subscribe: withFilter(
        (_, __, ctx) =>
          ctx.pubsub.asyncIterator(SUBSCRIBTION_TYPES.DIRECT_CREATED),
        (payload, _, ctx) =>
          [
            payload.directCreated.receiverId,
            payload.directCreated.senderId,
          ].includes(ctx.user.id)
      ),
    },
    directDeleted: {
      subscribe: withFilter(
        (_, __, ctx) =>
          ctx.pubsub.asyncIterator(SUBSCRIBTION_TYPES.DIRECT_DELETED),
        (payload, _, ctx) =>
          [
            payload.directDeleted.receiverId,
            payload.directDeleted.senderId,
          ].includes(ctx.user.id)
      ),
    },
    messageCreated: {
      subscribe: withFilter(
        (_, __, ctx) =>
          ctx.pubsub.asyncIterator(SUBSCRIBTION_TYPES.MESSAGE_CREATED),
        (payload, args) => {
          return args.chatIds.includes(payload.messageCreated.chatId);
        }
      ),
    },
    messageDeleted: {
      subscribe: withFilter(
        (_, __, ctx) =>
          ctx.pubsub.asyncIterator(SUBSCRIBTION_TYPES.MESSAGE_DELETED),
        (payload, args) => args.chatIds.includes(payload.messageDeleted.chat.id)
      ),
    },
    typingUser: {
      subscribe: withFilter(
        (_, __, ctx) =>
          ctx.pubsub.asyncIterator(SUBSCRIBTION_TYPES.TYPING_USER),
        (payload, args, ctx) =>
          payload.chatId === args.chatId &&
          payload.typingUser !== ctx.user.username
      ),
    },
    onlineUser: {
      subscribe: (_, __, ctx) =>
        ctx.pubsub.asyncIterator(SUBSCRIBTION_TYPES.ONLINE_USER),
    },
  },
};
