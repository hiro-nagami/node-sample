import { Resolvers, MutationResolvers, ResolversTypes } from 'generated/graphql'
import fs from "fs";

import { credentials } from '@grpc/grpc-js';
import { TodoServiceClient } from 'gen/proto/todo_service_grpc_pb';
import { CreateTodoRequest, NewTodo, Todo } from 'gen/proto/todo_service_pb';
import { time } from 'console';

const grpc_server_url=process.env.GRPC_SERVER_URL || 'localhost:4000';
export const typeDefs = fs.readFileSync("src/schema.graphql", { encoding: "utf8" });

export const grpcClientOptions = {
  "grpc.lb_policy_name": "round_robin",
  "grpc.dns_min_time_between_resolutions_ms": 5000,
  "grpc.keepalive_timeout_ms": 1000,
};

      
var todos = [
  new Todo().setTitle("title").setUserid(123)
]

export const resolvers: Resolvers = {
  Query: {
    todos: () => new Promise((resolve, reject) => {
      var ret = todos.map(val => {
        return {
          title: val.getTitle(),
          userId: val.getUserid()
        }
      })

      resolve(ret)
    })
  },
  Mutation: {
    createTodo: (arg, props) => new Promise((resolve, reject) => {
      const title = props.title?.valueOf();
      const userId = props.userId?.valueOf()

      if (!title) {
        reject()
        return
      }

      if (!userId) {
        reject()
        return
      }

      return createTodo({ title, userId })
    })
  }
}

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
        return
      }

      if (!response || !response.hasTodo()) {
        reject()
        return
      }


      resolve({
        title: response.getTodo()?.getTitle(),
        userId:response.getTodo()?.getUserid(),
      })
    });
  });
}
