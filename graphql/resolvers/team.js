export default {
  Query: {
    teams: async (_, __, { models, user }) =>
      await models.Team.findAll({
        include: [
          {
            model: models.User,
            attributes: ["username"],
            required: true,
            where: { id: 2 }
          }
        ]
      }).then(() => true)
  },
  Mutation: {
    createTeam: async (root, args, { models, user }) =>
      await models.Team.create({ ...args, owner: user.id })
        .then(() => true)
        .catch(() => false)
  }
};
