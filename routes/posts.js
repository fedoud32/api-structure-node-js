const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const verify = require('./checkToken');

// get all posts
router.get("/", verify, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json(err);
  }
});

// get one post by id
router.get("/:postId", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch (err) {
    res.json(err);
  }
});

// create post
router.post("/", verify, async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description
  });
  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json(err);
  }
});

// delete post by id
router.delete("/:postId", verify, async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId });
    res.send("deleted with success");
  } catch (err) {
    res.json(err);
  }
});

// patch a post

router.patch("/:postId", verify, async (req, res) => {
  try {
    const updatePost = await Post.updateOne({ _id: req.params.postId } ,{$set: req.body});
    res.json(updatePost);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
