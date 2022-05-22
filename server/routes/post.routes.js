import express from "express";

import { checkAuth } from "../middleware/check-auth.js";
import uploadImage from "../middleware/multer.js";
import {
  createPost,
  getSinglePost,
  updatePost,
  deletePost,
  getAllPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post(
    "",
    checkAuth,
    uploadImage,
    createPost);

router.get("/:id", getSinglePost);

router.put(
  "/:id",
  checkAuth,
  uploadImage,
  updatePost);

router.delete(
  "/:id",
  checkAuth,
  deletePost);

router.get("", getAllPosts);

export default router;
