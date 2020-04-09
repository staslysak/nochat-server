import { SUBS } from "../constants";
import { withFilter } from "apollo-server";

export default {
  Subscription: {
    newDirect: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(SUBS.NEW_DIRECT),
        (payload, _, { user }) =>
          payload.newDirect.user1Id === user.id ||
          payload.newDirect.user2Id === user.id
      ),
    },
    deleteDirect: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(SUBS.DELETE_DIRECT),
        (payload, _, { user }) =>
          payload.deleteDirect.user1Id === user.id ||
          payload.deleteDirect.user2Id === user.id
      ),
    },
  },
  Direct: {
    user: async ({ user1Id, user2Id }, __, { models, user }) => {
      const id = user1Id === user.id ? user2Id : user1Id;
      return await models.User.findByPk(id, { raw: true });
    },
    messages: async ({ id }, __, { models }) =>
      await models.Message.findAll(
        {
          where: { chatId: id },
          order: [["created_at", "ASC"]],
          // limit: 100
        },
        { raw: true }
      ).catch((error) => {
        return [];
      }),
    lastMessage: async ({ id }, __, { models }) =>
      await models.Message.findOne(
        {
          where: { chatId: id },
          order: [["created_at", "DESC"]],
        },
        { raw: true }
      ),
    unread: async ({ id }, __, { models, user }) =>
      await models.Message.count(
        {
          where: {
            chatId: id,
            unread: true,
            userId: { $ne: user.id },
          },
        },
        { raw: true }
      ),
  },
  Query: {
    directLastMessage: async (_, { chatId }, { models }) =>
      await models.Message.findOne(
        {
          where: { chatId },
          order: [["created_at", "DESC"]],
        },
        { raw: true }
      ),
    currentDirect: async (_, { userId }, { models, user }) => {
      const recipient = await models.User.findByPk(userId, { raw: true });

      return await models.Direct.findOne(
        {
          where: {
            $or: [
              { user1Id: user.id, user2Id: userId },
              { user1Id: userId, user2Id: user.id },
            ],
          },
        },
        { raw: true }
      )
        .then((direct) => ({ direct: direct.dataValues, recipient }))
        .catch(() => ({ recipient }));
    },
    directs: async (_, __, { models, user }) =>
      await models.Direct.findAll(
        {
          where: {
            $or: [{ user1Id: user.id }, { user2Id: user.id }],
          },
        },
        { raw: true }
      ),
  },
  Mutation: {
    createDirect: async (_, { userId, text }, { models, user, pubsub }) => {
      const exists = await models.Direct.findOne({
        where: {
          $or: [
            { user1Id: user.id, user2Id: userId },
            { user2Id: user.id, user1Id: userId },
          ],
        },
      });

      if (exists) {
        return exists;
      }

      return await models.Direct.create({
        user1Id: user.id,
        user2Id: userId,
      }).then(async (newDirect) => {
        await models.Message.create({
          userId: user.id,
          chatId: newDirect.id,
          text,
        });

        pubsub.publish(SUBS.NEW_DIRECT, { newDirect });
        return newDirect;
      });
    },
    deleteDirect: async (_, { id }, { models, pubsub }) =>
      await models.Direct.findByPk(id).then(
        async (deleteDirect) =>
          await models.Direct.destroy({ where: { id } })
            .then(() => {
              pubsub.publish(SUBS.DELETE_DIRECT, { deleteDirect });
              return true;
            })
            .catch(() => false)
      ),
  },
};
