// import { checkAuth, initialize } from 'usecase/common'
import express from 'express';
const cors = require('cors');

import { resolvers, typeDefs } from 'controller/resolver';
// initialize()

import { dependency } from 'controller/dependency'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'

export const app: express.Express = express()
const router = express.Router()
import http from 'http'

app.use(dependency.common.cors)
app.use(cors({ origin: true, credentials: true }));
app.use(router)

// app.post<ParamsDictionary, any, any, RequestParams>()
export async function listen(port: string) {
    const httpServer = http.createServer(app)
  
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })
    await server.start()

    server.applyMiddleware({ app })
  
    return new Promise((resolve, reject) => {
      httpServer.listen(port).once('listening', resolve).once('error', reject)
    })
}

// app.post<ParamsDictionary, any, any, RequestParams>(
//     "*/v1/createTodo",
//     async (request, response) => {
//         const { title, userId } = request.query;

//         try {
//             const result = await createTodo({ title: title, userId: userId })
//             response.json(result)
//         } catch (error) {
//             response.status(500).json({error});
//         }
//     }
// );
