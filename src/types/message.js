export default `
  type Message {
    id: Int!
    userId: Int!
    chatId: Int!
    text: String!
    unread: Boolean!
    createdAt: String!
  }

  type Subscription {
    newMessage(chatId: Int!): Message!
    deleteMessage(chatId: Int!): Message!
  }

  type Mutation {
    createMessage(chatId: Int, text: String!): Boolean!
    deleteMessage(id: Int!): Boolean!
    readMessage(id: Int!): Int!
  }
`;
