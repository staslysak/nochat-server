export default `
type Message {
  id: Int!
  userId: Int!
  chatId: Int!
  text: String!
  unread: Boolean!
  createdAt: String!
}

type MessageDeleted {
  ids: Int
  chat: Direct
}

type Subscription {
  messageCreated(chatIds: [Int]): Message!
  messageDeleted(chatIds: [Int]): MessageDeleted!
  typingUser(chatId: Int!): String!
}

type Query {
  messages(chatId: Int!, offset: Int): [Message!]!
}

type Mutation {
  readMessage(id: Int!): Int!
  deleteMessage(id: Int!): Boolean!
  createMessage(chatId: Int, text: String!): Boolean!
  typeMessage(chatId: Int!, username: String): Boolean!
}
`;
