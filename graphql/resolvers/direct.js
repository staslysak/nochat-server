import { SUBS } from "../../constants";

export default {
  Direct: {
    user: async ({ user1Id, user2Id }, __, { models, user }) => {
      const userId = user1Id === user.id ? user2Id : user1Id;

      return await models.User.findOne(
        { where: { id: userId } },
        { raw: true }
      );
    },
    messages: async ({ id }, __, { models }) =>
      await models.Message.findAll(
        {
          where: { chatId: id },
          order: [["created_at", "ASC"]],
          limit: 100
        },
        { raw: true }
      ).catch(() => null),
    lastMessage: async ({ id }, __, { models }) =>
      await models.Message.findOne(
        {
          where: { chatId: id },
          order: [["created_at", "DESC"]]
        },
        { raw: true }
      ).catch(() => null),
    unread: async ({ id }, __, { models }) =>
      await models.Message.count(
        { where: { chatId: id, unread: true } },
        { raw: true }
      ).catch(() => null)
  },
  Query: {
    direct: async (_, { userId }, { models, user }) => {
      const recipient = await models.User.findOne({ where: { id: userId } });

      return await models.Direct.findOne(
        {
          where: {
            [models.Sequelize.Op.or]: [
              { user1Id: user.id, user2Id: userId },
              { user1Id: userId, user2Id: user.id }
            ]
          }
        },
        { raw: true }
      )
        .then(direct => ({ direct: direct.dataValues, recipient }))
        .catch(() => ({ recipient }));
    },
    directs: async (_, __, { models, user }) =>
      await models.Direct.findAll(
        {
          where: {
            [models.Sequelize.Op.or]: [
              { user1Id: user.id },
              { user2Id: user.id }
            ]
          }
        },
        { raw: true }
      )
  },
  Mutation: {
    createDirect: async (_, { userId, text }, { models, user, pubsub }) =>
      await models.Direct.create({ user1Id: user.id, user2Id: userId })
        .then(async direct => {
          await models.Message.create({
            userId: user.id,
            chatId: direct.id,
            text
          });
          return direct;
        })
        .then(async direct => {
          return await models.Direct.findOne({ where: { id: direct.id } });
        })
  }
};
