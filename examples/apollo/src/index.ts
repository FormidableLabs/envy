import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { mergeDeep } from 'apollo-utilities';

import catFactsSchema from './schema/catFacts/schema';
import cocktailsSchema from './schema/cocktails/schema';
import xkcdSchema from './schema/xkcd/schema';
import catFactsResolvers from './schema/catFacts/resolvers';
import cocktailsResolvers from './schema/cocktails/resolvers';
import xkcdResolvers from './schema/xkcd/resolvers';

const baseSchema = `#graphql
  # allows Query type to be extended
  type Query
`;

const typeDefs = [baseSchema, catFactsSchema, cocktailsSchema, xkcdSchema];
const resolvers = mergeDeep(catFactsResolvers, cocktailsResolvers, xkcdResolvers);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  // eslint-disable-next-line no-console
  console.log(`🚀 GQL server ready at: ${url}`);
})();
