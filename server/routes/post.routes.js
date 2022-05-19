import express from "express";
import Post from "../models/post.js";

const router = express.Router();

router.get("/:id", (req, res, next) => {
  // if( !mongoose.Types.ObjectId.isValid(id) ) return false;
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.put("/:id", (req, res, next) => {
  // if( !mongoose.Types.ObjectId.isValid(id) ) return false;
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Post updated",
      })
    });
});

router.delete("/:id", (req, res, next) => {
  // if( !mongoose.Types.ObjectId.isValid(id) ) return false;
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({
      message: "Post deleted",
    })
  })
});

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  });
});

router.get("" ,(req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched",
      posts: documents
    })
  });
});

export default router;
