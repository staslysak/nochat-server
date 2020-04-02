export default `
  type Team {
    owner: User!
    members: [User!]!
  }

  type Query {
    teams: Boolean
  }

  type Mutation {
    createTeam(name: String!): Boolean!
  }
`;
