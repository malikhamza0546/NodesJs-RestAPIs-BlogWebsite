const express = require("express");
const { response } = require("../app");
const router = express.Router();
const User = require("../model/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
router.post("/signup", (req, res) => {
  User.find({ email: req.body.email })
    .then((result) => {
      if (result.length > 0) {
        return res.status(500).json({
          msg: "Email already exist",
        });
      }
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: err,
          });
        }
        console.log("signup Up Post Request", req.body);
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
        });
        newUser
          .save()
          .then((result) => {
            res.status(200).json({
              newUser: result,
            });
          })
          .catch((err) => {
            res.status(200).json({
              error: err,
            });
          });
      });
    })
    .catch(() => {});

  //   res.send("login");
});

router.post("/login", (req, res) => {
  console.log("login Up Post Request");
  //   res.send("login");
  User.find({ email: req.body.email })
    .then((user) => {
      console.log("Tyuuu", user);
      if (user.length > 0) {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (!result) {
            return res.status(401).json({
              Error: "Password Does not Match",
            });
          }
          console.log("JWT Token");
          const token = jwt.sign(
            {
              firstName: user[0].firstName,
              lastName: user[0].lastName,
              email: user[0].email,
              userId: user[0]._id,
            },
            "sbs 147",
            {
              expiresIn: "8h",
            }
          );
          res.status(200).json({
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            email: user[0].email,
            userId: user[0]._id,
            Token: token,
          });
        });
      }
      if (user.length < 1) {
        return res.status(401).json({
          Error: "Email Does not exist",
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        Error: err,
      });
    });
});

module.exports = router;
