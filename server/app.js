import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import postRoutes from "./routes/post.routes.js";

const app = express();

mongoose.connect(process.env.CONNECTION_URL)
  .then(() => {
    console.log("Connect to database");
  })
  .catch(() => {
    console.log("Error with connection");
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
})

app.use("/api/posts", postRoutes);

export default app;
