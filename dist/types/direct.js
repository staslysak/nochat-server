"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\n  type Direct {\n    id: Int!\n    user: User\n    unread: Int\n    createdAt: String!\n    lastMessage: Message\n  }\n\n  type CurrentDirect {\n    direct: Direct\n    recipient: User\n  }\n\n  type Subscription {\n    newDirect: Direct\n    deleteDirect: Direct!\n  }\n\n  type Query {\n    directs: [Direct!]\n    currentDirect(userId: Int!): CurrentDirect\n    directLastMessage(chatId: Int!): Message!\n  }\n  \n  type Mutation {\n    createDirect(userId: Int!, text: String): Direct!\n    deleteDirect(id: Int!): Boolean!\n  }\n";
exports.default = _default;