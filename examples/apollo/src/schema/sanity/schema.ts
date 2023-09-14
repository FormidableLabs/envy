export default `#graphql

  type Category {
    id: ID!
    name: String!
    description: String
  }

  type CategoryWithProduct {
    id: ID!
    name: String!
    description: String
    products: [Product!]!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    categoryIds: [String!]!
    variants: [ProductVariant!]!
  }

  type ProductVariant {
    id: ID!
    name: String!
    price: Float!
  }

  extend type Query {
    allCategories: [Category!]!
    allProducts: [Product!]!
    categoriesWithProducts: [CategoryWithProduct!]!
  }
`;
