export default `
  type Direct {
    id: Int!
    createdAt: String!
    messages: [Message!]
    user: User
    unread: Int
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
