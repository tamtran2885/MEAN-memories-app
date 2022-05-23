import Post from "../models/post.js";

export const createPost = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  try {
    await post.save();
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...post,
        id: post._id,
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "New post NOT created"
    })
  }
}

export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({
      error: err.message,
      message: "Page not found"
    });
  }
}

export const updatePost = async (req, res) => {
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

  try {
    const result = await Post.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    }, post);
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
  } catch (err) {
    res.status(500).json({ message: "Post NOT updated"})
  }
}

export const deletePost = async (req, res) => {
  // console.log(req.params.id);

  try {
    const result = await Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    })

    if (result.deletedCount > 0) {
      res.status(200).json({
        message: "Post deleted"
      })
    } else {
      res.status(401).json({
        message: "Post NOT AUTHORIZED to be deleted",
      })
    }
  } catch (err) {
    res.status(500).json({
      message: "Post CAN NOT BE deleted"
    })
  }
}

export const getAllPosts = (req, res) => {
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
