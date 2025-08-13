import { gql } from "@apollo/client";

export const USERS_QUERY = gql`
  query Users(
    $name: String
    $email: String
    $country: [String!]
    $registeredFrom: String
    $registeredTo: String
    $offset: Int
    $limit: Int
  ) {
    users(
      name: $name
      email: $email
      country: $country
      registeredFrom: $registeredFrom
      registeredTo: $registeredTo
      offset: $offset
      limit: $limit
    ) {
      id
      name
      email
      country
      registeredAt
    }
  }
`;
