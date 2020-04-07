export default (sequelize, DataTypes) => {
  const Direct = sequelize.define("direct", {
    // user: {
    //   type: DataTypes.VIRTUAL,
    //   get() {
    //     return this.get("user1") ? this.get("user1") : this.get("user2");
    //   }
    // }
  });

  // USER JOIN
  //   {
  //     model: models.User,
  //     as: "user1",
  //     required: false,
  //     where: { id: { [models.Sequelize.Op.ne]: user.id } }
  //   },
  //   {
  //     model: models.User,
  //     as: "user2",
  //     required: false,
  //     where: { id: { [models.Sequelize.Op.ne]: user.id } }
  //   },

  Direct.associate = (models) => {
    Direct.belongsTo(models.User, {
      foreignKey: "user1Id",
      // as: "user1"
    });
    Direct.belongsTo(models.User, {
      foreignKey: "user2Id",
      // as: "user2"
    });
    Direct.hasMany(models.Message, {
      as: "messages",
      foreignKey: "chatId",
      onDelete: "cascade",
    });
  };

  return Direct;
};
