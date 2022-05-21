import express from "express";
import Post from "../models/post.js";
import multer from "multer";

import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "server/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
    "",
    checkAuth,
    multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  });
});

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

router.put(
  "/:id",
  checkAuth,
  multer({storage: storage}).single("image"),
  (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  // console.log(post);
  Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      // console.log(result);
      if (result) {
        res.status(200).json({
          message: "Post updated",
        })
      } else {
        res.status(404).json({ message: "Error, can not update" });
      }
    });
});

router.delete(
  "/:id",
  checkAuth,
  (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({
      message: "Post deleted",
    })
  })
});

router.get("" ,(req, res, next) => {
  // console.log(req.query)
  // Query extracted from url is string, needed to be numeric
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

export default router;
