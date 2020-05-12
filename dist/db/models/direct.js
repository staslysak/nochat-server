"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (sequelize, DataTypes) => {
  const Direct = sequelize.define("direct", {}, {});

  Direct.associate = function (db) {
    // associations can be defined here
    Direct.belongsTo(db.user, {
      foreignKey: {
        name: "senderId",
        field: "sender_id"
      },
      foreignKey: "senderId" // as: "sender",

    });
    Direct.belongsTo(db.user, {
      foreignKey: {
        name: "receiverId",
        field: "receiver_id"
      },
      foreignKey: "receiverId" // as: "receiver",

    });
    Direct.hasMany(db.message, {
      as: "messages",
      foreignKey: {
        name: "chatId",
        field: "chat_id"
      },
      onDelete: "CASCADE"
    });
  };

  return Direct;
};

exports.default = _default;