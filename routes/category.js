const express = require("express");
const { response } = require("../app");
const router = express.Router();
const Category = require("../model/category");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/checkAuth");
const jwt = require("jsonwebtoken");
router.post("/", checkAuth, (req, res) => {
  const newCategory = new Category({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    UserId: req.body.UserId,
    ImageUrl: req.body.ImageUrl,
  });
  newCategory
    .save()
    .then((result) => {
      res.status(200).json({
        newCategory: result,
        Msg: "Category Added",
      });
    })
    .catch((err) => {
      res.status(200).json({
        error: err,
      });
    });
});

router.get("/", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "sbs 147");
  console.log(verify, "Verified");
  Category.find({ UserId: verify.userId })
    .select("_id UserId title ImageUrl") // Fixed syntax for select
    .then((result) => {
      // Properly handle successful result
      res.status(200).json({ categories: result });
    })
    .catch((err) => {
      // Properly handle errors
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:id", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "sbs 147");
  console.log(verify, "Verified");

  Category.deleteOne({
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

router.put("/:id", (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "sbs 147");
    console.log(verify, "Verified");

    Category.findOneAndUpdate(
      { _id: req.params.id, UserId: verify.userId },
      {
        title: req.body.title,
        ImageUrl: req.body.ImageUrl,
      },
      { new: true } // This option returns the updated document
    )
      .then((updatedCategory) => {
        console.log(updatedCategory);
        if (!updatedCategory) {
          return res.status(404).json({
            Msg: "Category not found or you are not authorized to update it",
          });
        }
        res.status(200).json({
          categories: updatedCategory,
          Msg: "Category Updated",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          Error: err,
          Msg: "Category Not Updated",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      Msg: "Invalid Token",
    });
  }
});

module.exports = router;
