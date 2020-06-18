const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const verify = require("./checkToken");
const jwtDecode = require("jwt-decode");
const User = require("../models/user");

// utils
const cleanSulg = (slug) => {
  const noSpace = slug.replace(" ", "-").trim();
  noSpace.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return noSpace;
};

// get all posts
router.get("/", async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  try {
    const posts = await Post.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    const count = await Post.countDocuments();
    res.json({
      data: {
        posts,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page, 10),
        perPage: limit,
        count: count,
      },
      status: 200,
    });
  } catch (err) {
    res.json(err);
  }
});

// get one post by id
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json({
      data: {
        post,
      },
      status: 200,
    });
  } catch (err) {
    res.json(err);
  }
});

// create post
router.post("/", verify, async (req, res) => {
  const token = req.header("Authorization")
  const activeToken = token.substring(7)
  const decode = jwtDecode(activeToken);
  const user = await User.findById(decode._id).select("firstName lastName");
  console.log(user)
  const slug = cleanSulg(req.body.title)
  const post = new Post({
    slug: slug,
    title: req.body.title,
    description: req.body.description,
    body: req.body.body,
    approved: req.body.approved,
    tags: req.body.tags,
    user: user,
  });
  try {
    const savedPost = await post.save();
    res.json({
      data: {
        savedPost,
      },
      status: 200,
    });
  } catch (err) {
    res.send({ message: err });
  }
});

// delete post by id
router.delete("/:postId", verify, async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId });
    res.send({
      data: { message: "deleted with success", },
      status: 200 
    });
  } catch (err) {
    res.json({ message: err });
  }
});

// patch a post

router.patch("/:postId", verify, async (req, res) => {
  try {
    const updatePost = await Post.updateOne(
      { _id: req.params.postId },
      { $set: req.body }
    );
    res.json({
      data: {
        updatePost,
      },
      status: 200,
    });
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
