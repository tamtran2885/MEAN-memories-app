import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
})

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post added successfully"
  });
});

app.get("/api/posts" ,(req, res, next) => {
  const posts = [
    { id: "fsdfsdfsdf", title: "hello 1", content: "server 111" },
    { id: "fsdfszxczczf", title: "hello 2", content: "server 222" },
  ];
  res.status(200).json({
    message: "Posts fetched",
    posts: posts
  })
});

export default app;
