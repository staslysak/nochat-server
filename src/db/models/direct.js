export default (sequelize, DataTypes) => {
  const Direct = sequelize.define("direct", {}, {});

  Direct.associate = function (models) {
    // associations can be defined here
    Direct.belongsTo(models.user, {
      foreignKey: { name: "senderId", field: "sender_id" },
      foreignKey: "senderId",
      // as: "sender",
    });
    Direct.belongsTo(models.user, {
      foreignKey: { name: "receiverId", field: "receiver_id" },
      foreignKey: "receiverId",
      // as: "receiver",
    });
    Direct.hasMany(models.message, {
      as: "messages",
      foreignKey: { name: "chatId", field: "chat_id" },
      onDelete: "CASCADE",
    });
  };

  return Direct;
};
