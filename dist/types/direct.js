"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = `
type Direct {
  id: Int
  user: User
  unread: Int
  createdAt: String
  messages: [Message]
  lastMessage: Message
}

type Subscription {
  directCreated: Direct
  directDeleted: Direct!
}

type Query {
  directs: [Direct!]
  direct(userId: Int, id: Int): Direct
}

type Mutation {
  createDirect(userId: Int!, text: String): Direct!
  deleteDirect(id: Int!): Boolean!
}
`;
exports.default = _default;