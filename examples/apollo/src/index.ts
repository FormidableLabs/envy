// eslint-disable-next-line import/order
import { enableTracing } from '@envyjs/node';
enableTracing({ serviceName: 'examples/apollo' });

import http from 'http';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { mergeDeep } from 'apollo-utilities';
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';

import catFactsResolvers from './schema/catFacts/resolvers';
import catFactsSchema from './schema/catFacts/schema';
import cocktailsResolvers from './schema/cocktails/resolvers';
import cocktailsSchema from './schema/cocktails/schema';
import sanityResolvers from './schema/sanity/resolvers';
import sanitySchema from './schema/sanity/schema';
import xkcdResolvers from './schema/xkcd/resolvers';
import xkcdSchema from './schema/xkcd/schema';

const baseSchema = `#graphql
  # allows Query type to be extended
  type Query
`;

const typeDefs = [baseSchema, catFactsSchema, cocktailsSchema, sanitySchema, xkcdSchema];
const resolvers = mergeDeep(catFactsResolvers, cocktailsResolvers, sanityResolvers, xkcdResolvers);

const app = express();

// Optionally, set cors header to allow timing data capture
app.use((_, response, next) => {
  // response.setHeader('Timing-Allow-Origin', '*');
  next();
});

const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

(async () => {
  await server.start();

  app.use('/graphql', cors<cors.CorsRequest>(), json(), expressMiddleware(server));

  await httpServer.listen({ port: 4000 });

  // eslint-disable-next-line no-console
  console.log(`🚀 GQL server ready at: http://localhost:4000/graphql`);
})();
