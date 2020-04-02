export default `
  type Message {
    id: Int!
    text: String!
    userId: Int!
    chatId: Int!
    createdAt: String!
  }

  type Subscription {
    newMessage(chatId: Int!): Message
  }

  type Query {
    deleteMessage(id: Int!): Boolean!
  }

  type Mutation {
    createMessage(chatId: Int, text: String!): Boolean!
  }
`;
