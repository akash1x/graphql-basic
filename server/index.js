const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

async function init() {
  const app = express();
  /*Create instance of apollo server
  type definations and resolvers goes into config of apollo server instance*/
  const config = {
    typeDefs: `
    type User{
        id:ID!,
        name:String!,
        username:String!,
        email:String!,
        phone:String!,
        website:String!,
    }
    type Todo{
        id:ID!,
        title:String!,
        completed:Boolean
        user:User 
        userId:ID!
    }

    type Query{
        getTodos:[Todo]
        getAllUsers:[User]
        getAllUserById(id:ID!):User
    }
    `,
    resolvers: {
      Todo: {
        //If anyone wants to find user of the todo then perform this logic
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
          ).data,
      },
      Query: {
        //Here basically we call our services which interact with repositories and get our data
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getAllUserById: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  };
  const server = new ApolloServer(config);

  app.use(bodyParser.json());
  app.use(cors());

  //Start the Apollo server
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen("8000", () => {
    console.log("Server started at port 8000");
  });
}

init();
