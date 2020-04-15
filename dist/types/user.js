"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = `
  type User {
    id: Int!
    email: String!
    avatar: String!
    status: String!
    username: String!
    createdAt: String!
    online: Boolean!
    lastSeen: String!
  }

  type LoginResponse {
    user: User
    token: String
    refreshToken: String
  }

  type Subscription {
    onlineUser: User!
  }

  type Query {
    currentUser: User!
    users(username: String): [User!]
    onlineUsers: [User!]
  }
  
  type Mutation {
    logout: Boolean
    verifyUser(secret: String!): LoginResponse!
    login(username: String!, password: String!): LoginResponse!
    register(username: String!, email: String!, password: String!): Boolean!
  }
`;
exports.default = _default;