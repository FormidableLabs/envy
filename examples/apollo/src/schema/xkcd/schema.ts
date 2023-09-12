export default `#graphql

  type XkdcComic {
    id: ID!
    title: String!
    imageUrl: String!
  }

  extend type Query {
    latestXkcd: XkdcComic!
  }
`;
