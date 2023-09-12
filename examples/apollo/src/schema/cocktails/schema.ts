export default `#graphql

  type Cocktail {
    id: ID!
    name: String!
    ingredients: [String!]!
    instructions: String!
    imageUrl: String
  }

  extend type Query {
    randomCocktail: Cocktail!
  }
`;
