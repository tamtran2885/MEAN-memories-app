import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
dotenv.config();

mongoose.connect("mongodb+srv://tamtran:" + process.env.MONGO_ATLAS_PW + "@cluster0.biq1t93.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connect to database");
  })
  .catch(() => {
    console.log("Error with connection");
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// To access images folder
app.use("/images", express.static(path.join("server/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
})

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

export default app;
