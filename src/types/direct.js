export default `
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
    newDirect: Direct
    deleteDirect: Direct!
  }

  type Query {
    directs: [Direct!]
    currentDirect(userId: Int!): CurrentDirect
    directLastMessage(chatId: Int!): Message!
  }
  
  type Mutation {
    createDirect(userId: Int!, text: String): Direct!
    deleteDirect(id: Int!): Boolean!
  }
`;
