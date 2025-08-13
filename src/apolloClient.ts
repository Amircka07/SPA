import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000" }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            keyArgs: ["name","email","country","registeredFrom","registeredTo"],
            merge(existing: unknown[] = [], incoming: unknown[], { args }) {
              const offset = (args?.offset ?? 0) as number;
              const merged = existing ? existing.slice(0) : [];
              for (let i = 0; i < incoming.length; i++) {
                merged[offset + i] = incoming[i];
              }
              return merged;
            },
            read(existing: unknown[] | undefined, { args }) {
              if (!existing) return undefined;
              const offset = (args?.offset ?? 0) as number;
              const limit = (args?.limit ?? existing.length) as number;
              return existing.slice(offset, offset + limit);
            }
          }
        }
      }
    }
  })
});
