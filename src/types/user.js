export default `
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
    setOnline: User
    setOffline: User
    logout: Boolean
    verifyUser(secret: String!): LoginResponse!
    login(username: String!, password: String!): LoginResponse!
    createUser(username: String!, email: String!, password: String!): Boolean!
  }
`;
