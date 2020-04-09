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
    userTyping(chatId: Int!): String!
  }

  type Mutation {
    readMessage(id: Int!): Int!
    deleteMessage(id: Int!): Boolean!
    createMessage(chatId: Int, text: String!): Boolean!
    userTyping(chatId: Int!, username: String): Boolean!
  }
`;
