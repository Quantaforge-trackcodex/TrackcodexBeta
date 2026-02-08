export const typeDefs = `
  interface Node {
    id: ID!
  }

  type Query {
    node(id: ID!): Node
    me: User
    user(username: String!): User
    repository(owner: String!, name: String!): Repository
    organization(slug: String!): Organization
  }

  type Mutation {
    createRepository(
      name: String!
      description: String
      visibility: String
    ): Repository
  }

  type User implements Node {
    id: ID!
    username: String!
    name: String
    avatar: String
    repositories(limit: Int): [Repository]
    organizations: [Organization]
  }

  type Repository implements Node {
    id: ID!
    name: String!
    description: String
    isPrivate: Boolean!
    owner: User
    organization: Organization
    createdAt: String!
    updatedAt: String!
  }

  type Organization implements Node {
    id: ID!
    name: String!
    slug: String!
    members: [User]
    repositories: [Repository]
  }
`;
