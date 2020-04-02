export default (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    text: DataTypes.TEXT,
    unread: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Message.associate = models => {
    Message.belongsTo(models.User, { foreignKey: "userId" });
    Message.belongsTo(models.Direct, { foreignKey: "chatId" });
  };

  return Message;
};
