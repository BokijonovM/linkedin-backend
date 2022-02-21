import express from "express";
import listEndpoints from "express-list-endpoints";
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