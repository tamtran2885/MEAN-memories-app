import Post from "../models/post.js";

export const createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  // console.log(req.userData);
  // return res.status(200).json({});
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "New post NOT created"
    })
  })
}

export const getSinglePost = (req, res, next) => {
  // if( !mongoose.Types.ObjectId.isValid(id) ) return false;
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
}

export const updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  // console.log(post);
  Post.updateOne({
    _id: req.params.id,
    creator: req.userData.userId
  }, post)
    .then(result => {
      // console.log(result);
        if (result.modifiedCount > 0) {
          res.status(200).json({
            message: "Post updated",
          })
        } else {
          res.status(401).json({
            message: "Post NOT AUTHORIZED to be updated",
          })
        }
    })
    .catch((err) => {
      res.status(500).json({ message: "Post NOT updated"})
    })
}

export const deletePost = (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(result => {
    // console.log(result);
    if (result.deletedCount > 0) {
      res.status(200).json({
        message: "Post deleted"
      })
    } else {
      res.status(401).json({
        message: "Post NOT AUTHORIZED to be deleted",
      })
    }
  })
  .catch((err) => {
    res.status(500).json({
      message: "Post CAN NOT BE deleted"
    })
  })
}

export const getAllPosts = (req, res, next) => {
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
    })
    .catch(err => {
      res.status(500).json({
        message: "Fail to fetch post"
      })
    });
}
