import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import expereincesRouter from "./services/experience/model.js";

const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/profile", expereincesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server runnning on port: ", port);
  });
});
import mongoose from "mongoose";
import cors from "cors"
import postRouter from "./services/postmode/index.js";


import { badRequestHandler, unauthorizedHandler,notFoundHandler, genericErrorHandler } from "./errorHandlers.js"

const server = express()

const port = process.env.PORT

server.use(cors())
server.use(express.json())

server.use("/posts",postRouter)


server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", ()=>{
console.log("OK connected to MONGODB")
server.listen(port, ()=>{
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
    })
})
