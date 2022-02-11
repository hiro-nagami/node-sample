// import { checkAuth, initialize } from 'usecase/common'
import express from 'express';
const cors = require('cors');

import { credentials } from '@grpc/grpc-js';
// initialize()

import { dependency } from 'controller/dependency'
import { TodoServiceClient } from 'gen/proto/todo_service_grpc_pb';
import { CreateTodoRequest, NewTodo } from 'gen/proto/todo_service_pb';
import { ParamsDictionary } from "express-serve-static-core";

export const app: express.Express = express()
const router = express.Router()

const grpc_server_url=process.env.GRPC_SERVER_URL || 'localhost:4000';

app.use(dependency.common.cors)
app.use(cors({ origin: true, credentials: true }));
app.use(router)

export const grpcClientOptions = {
    "grpc.lb_policy_name": "round_robin",
    "grpc.dns_min_time_between_resolutions_ms": 5000,
    "grpc.keepalive_timeout_ms": 1000,
};

type RequestParams = {
    title: string;
    userId: number;
}

function createTodo({ title, userId }: RequestParams) {
    const request = new CreateTodoRequest;
    const client = new TodoServiceClient(
        grpc_server_url,
        credentials.createInsecure(),
        grpcClientOptions
    )

    const newTodo = new NewTodo()
    
    newTodo.setTitle(title);
    newTodo.setDone(false);
    newTodo.setUserid(userId);

    request.setTodo(newTodo);

    return new Promise((resolve, reject) => {
        client.createTodo(request, (error, response) => {
          if (error) {
            console.error(error);
            reject({
              code: error?.code || 500,
              message: error?.message || "something went wrong",
            });
          }
    
          return resolve(response.toObject());
        });
      });
}

// app.post<ParamsDictionary, any, any, RequestParams>()
app.post<ParamsDictionary, any, any, RequestParams>(
    "*/v1/createTodo",
    async (request, response) => {
        const { title, userId } = request.query;

        try {
            const result = await createTodo({ title: title, userId: userId })
            response.json(result)
        } catch (error) {
            response.status(500).json({error});
        }
    }
);

app.get('*/v1/gettest',(req: any, res: any) => {
    res.send({
        data: {
            message: 'Call gettest of get method',
        }
    })
})
app.post('*/v1/posttest', (req: any, res: any) => {
    res.send({
        data: {
            message: 'Call posttest of post method',
        }
    })
})
