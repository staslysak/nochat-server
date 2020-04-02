export default `
  type User {
    id: Int!
    username: String!
    status: String!
    email: String!
    createdAt: String!
    avatar: String!
  }

  type RegisterResponse {
    user: User
    token: String
    refreshToken: String
  }

  type LoginResponse {
    user: User
    token: String
    refreshToken: String
  }

  type Query {
    user: User!
    users(username: String): [User!]
  }
  
  type Mutation {
    createUser(username: String!, email: String!, password: String!): Boolean!
    login(username: String!, password: String!): LoginResponse!
    logout: Boolean
    verifyUser(secret: String!): LoginResponse!
  }
`;
