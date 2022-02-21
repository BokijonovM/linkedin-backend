import express from "express";
import cors from "cors";
import profileRoutes from "./services/profiles/index.js";
import mongoose from "mongoose";
const server = express();
const port = process.env.PORT || 3001;
server.use(cors());
server.use(express.json());
server.use("/profiles",profileRoutes)
 mongoose.connect(process.env.MONGO_CONNECTION);
 mongoose.connection.on("connected", () => {
      console.log("connected to mongo");
  server.listen(port, () => {
    console.log("server is running on port", port);
  });
 });
