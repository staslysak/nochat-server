export default (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "message",
    {
      text: DataTypes.TEXT,
      unread: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "text",
      },
    },
    {
      indexes: [
        {
          fields: ["created_at"],
        },
      ],
    }
  );

  Message.associate = (models) => {
    Message.belongsTo(models.user, {
      foreignKey: { name: "userId", field: "user_id" },
    });
    Message.belongsTo(models.direct, {
      foreignKey: { name: "chatId", field: "chat_id" },
    });
  };

  return Message;
};
