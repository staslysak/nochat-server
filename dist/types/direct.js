"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = `
type Direct {
  id: Int!
  user: User
  unread: Int
  createdAt: String!
  lastMessage: Message
}

type CurrentDirect { 
  direct: Direct
  recipient: User
}

type Subscription {
  directCreated: Direct
  directDeleted: Direct!
}

type Query {
  directs: [Direct!]
  direct(id: Int!): Direct!
  currentDirect(userId: Int!): CurrentDirect
}

type Mutation {
  createDirect(userId: Int!, text: String): Direct!
  deleteDirect(id: Int!): Boolean!
}
`;
exports.default = _default;