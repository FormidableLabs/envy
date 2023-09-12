export default `#graphql

  type CatFact {
    id: ID!
    fact: String!
  }

  extend type Query {
    randomCatFact: CatFact!
  }
`;
