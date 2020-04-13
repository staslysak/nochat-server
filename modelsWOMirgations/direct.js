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
  //     as: "receiver",
  //     required: false,
  //     where: { id: { [models.Sequelize.Op.ne]: user.id } }
  //   },
  //   {
  //     model: models.User,
  //     as: "sender",
  //     required: false,
  //     where: { id: { [models.Sequelize.Op.ne]: user.id } }
  //   },

  Direct.associate = (models) => {
    Direct.belongsTo(models.User, {
      foreignKey: "receiverId",
      // as: "receiver"
    });
    Direct.belongsTo(models.User, {
      foreignKey: "senderId",
      // as: "sender"
    });
    Direct.hasMany(models.Message, {
      as: "messages",
      foreignKey: "chatId",
      onDelete: "cascade",
    });
  };

  return Direct;
};
