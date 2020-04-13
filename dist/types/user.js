"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\n  type User {\n    id: Int!\n    email: String!\n    avatar: String!\n    status: String!\n    username: String!\n    createdAt: String!\n    online: Boolean!\n    lastSeen: String!\n  }\n\n  type LoginResponse {\n    user: User\n    token: String\n    refreshToken: String\n  }\n\n  type Subscription {\n    onlineUser: User!\n  }\n\n  type Query {\n    currentUser: User!\n    users(username: String): [User!]\n    onlineUsers: [User!]\n  }\n  \n  type Mutation {\n    connect: User\n    disconnect: User\n    logout: Boolean\n    verifyUser(secret: String!): LoginResponse!\n    login(username: String!, password: String!): LoginResponse!\n    register(username: String!, email: String!, password: String!): Boolean!\n  }\n";
exports.default = _default;