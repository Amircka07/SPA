 
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { users } from "./data.ts";
import type { UsersArgs, User } from "./types";

const typeDefs =`
  type User {
    id: ID!
    name: String!
    email: String!
    country: String!
    registeredAt: String!
  }

  type Query {
    users(
      name: String
      email: String
      country: [String!]
      registeredFrom: String
      registeredTo: String
      offset: Int
      limit: Int
    ): [User!]!
  }
`;

const resolvers = {
  Query: {
    users: (_: unknown, args: UsersArgs): User[] => {
      const {
        name, email, country, registeredFrom, registeredTo,
        offset = 0, limit = 20
      } = args;

      let result = users.slice();

      if (name?.trim()) {
        const s = name.toLowerCase();
        result = result.filter(u => u.name.toLowerCase().includes(s));
      }
      if (email?.trim()) {
        const s = email.toLowerCase();
        result = result.filter(u => u.email.toLowerCase().includes(s));
      }
      if (country && country.length) {
        const set = new Set(country.map(c => c.toLowerCase()));
        result = result.filter(u => set.has(u.country.toLowerCase()));
      }
      if (registeredFrom) {
        const from = new Date(registeredFrom).getTime();
        result = result.filter(u => new Date(u.registeredAt).getTime() >= from);
      }
      if (registeredTo) {
        const to = new Date(registeredTo).getTime();
        result = result.filter(u => new Date(u.registeredAt).getTime() <= to);
      }
       // @ts-expect-error: Suppress TS error for slice
      return result.slice(offset, offset + limit);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, { listen: { port: 4000 } })
  .then(({ url }) => console.log(`🚀 GraphQL ready at ${url}`));
