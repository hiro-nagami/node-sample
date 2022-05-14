import express from 'express';
const cors = require('cors');

import { resolvers, typeDefs } from 'controller/resolver';
// initialize()

import { dependency } from 'controller/dependency'
import { ApolloServer } from 'apollo-server-express'
import http from 'http'
// import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

const app: express.Express = express()

app.use(dependency.common.cors)
app.use(cors({ origin: true, credentials: true }));
export const httpServer = http.createServer(app)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: true,
})
  
server.start().then(() => {
  server.applyMiddleware({ app, path: "/" })
})

export default app;