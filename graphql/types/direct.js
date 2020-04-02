export default `
  type Direct {
    id: Int
    createdAt: String
    user: User
    messages: [Message]
    lastMessage: Message
    unread: Int
  }

  type CurrentDirect {
    direct: Direct
    recipient: User
  }

  type Query {
    directs: [Direct!]
    direct(userId: Int!): CurrentDirect
  }
  
  type Mutation {
    createDirect(userId: Int!, text: String!): Direct!
  }
`;
