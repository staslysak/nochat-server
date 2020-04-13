"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\n  type Message {\n    id: Int!\n    userId: Int!\n    chatId: Int!\n    text: String!\n    unread: Boolean!\n    createdAt: String!\n  }\n\n  type Subscription {\n    newMessage(chatId: Int!): Message!\n    deleteMessage(chatId: Int!): Message!\n    userTyping(chatId: Int!): String!\n  }\n\n  type Query {\n    messages(chatId: Int!, offset: Int): [Message!]!\n  }\n\n  type Mutation {\n    readMessage(id: Int!): Int!\n    deleteMessage(id: Int!): Boolean!\n    createMessage(chatId: Int, text: String!): Boolean!\n    userTyping(chatId: Int!, username: String): Boolean!\n  }\n";
exports.default = _default;