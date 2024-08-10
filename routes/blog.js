const express = require("express");
const { response } = require("../app");
const router = express.Router();
const Blogs = require("../model/Blogs");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/checkAuth");
const jwt = require("jsonwebtoken");
router.post("/", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "sbs 147");
  //   console.log(verify, "Verified");
  const newBlog = new Blogs({
    _id: new mongoose.Types.ObjectId(),
    UserId: verify.userId,
    ImageUrl: req.body.ImageUrl,
    BlogTitle: req.body.BlogTitle,
    BlogContent: req.body.BlogContent,
    BlogCatogery: req.body.BlogCatogery,
    CatogeryID: req.body.CatogeryID,
  });
  newBlog
    .save()
    .then((result) => {
      res.status(200).json({
        newBlog: result,
        Msg: "Blog Added",
      });
    })
    .catch((err) => {
      res.status(200).json({
        error: err,
      });
    });
});

// get All Blogs
router.get("/getAllBlogs", (req, res) => {
  Blogs.find()
    .select("_id UserId ImageUrl BlogTitle BlogContent BlogCatogery CatogeryID") // Fixed syntax for select
    .then((result) => {
      // Properly handle successful result
      res.status(200).json({ Blogs: result });
    })
    .catch((err) => {
      // Properly handle errors
      res.status(500).json({
        error: err,
      });
    });
});

// getMyOwnPostedBlogs
router.get("/getMyOwnPostedBlogs", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "sbs 147");
  Blogs.find({ UserId: verify.userId })
    .select("_id UserId ImageUrl BlogTitle BlogContent BlogCatogery CatogeryID") // Fixed syntax for select
    .then((result) => {
      // Properly handle successful result
      res.status(200).json({ Blogs: result });
    })
    .catch((err) => {
      // Properly handle errors
      res.status(500).json({
        error: err,
      });
    });
});

// Delete Own Blogs

router.delete("/:id", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "sbs 147");
  console.log(verify, "Verified");

  Blogs.deleteOne({
    _id: req.params.id,
    UserId: verify.userId,
  })
    .then((result) => {
      res.status(200).json({
        msg: "Deleted Succes",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Error: err,
      });
    });
});

// Update Blogs

router.put("/:id", (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "sbs 147");
    console.log(verify, "Verified");

    Blogs.findOneAndUpdate(
      { _id: req.params.id, UserId: verify.userId },
      {
        BlogTitle: req.body.BlogTitle,
        BlogContent: req.body.BlogContent,
      },
      { new: true } // This option returns the updated document
    )
      .then((updatedBlogs) => {
        console.log(updatedBlogs);
        if (!updatedBlogs) {
          return res.status(404).json({
            Msg: "Blogs not found or you are not authorized to update it",
          });
        }
        res.status(200).json({
          categories: updatedBlogs,
          Msg: "Blogs Updated",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          Error: err,
          Msg: "Blogs Not Updated",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      Msg: "Invalid Token",
    });
  }
});

// Get Blogs by category
router.get("/BlogsByCategory", (req, res) => {
  Blogs.find({ BlogCatogery: req.body.BlogCatogery })
    .select("_id UserId ImageUrl BlogTitle BlogContent BlogCatogery CatogeryID") // Fixed syntax for select
    .then((result) => {
      // Properly handle successful result
      res.status(200).json({ Blogs: result });
    })
    .catch((err) => {
      // Properly handle errors
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
