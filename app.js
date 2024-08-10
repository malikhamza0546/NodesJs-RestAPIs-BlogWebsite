const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const catRoute = require("./routes/category");
// const commentRoute = require("./routes/comment");
const blogRoute = require("./routes/blog");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose
  .connect(
    "mongodb+srv://Adi:Adnan123@atlascluster.vvo59t9.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"
  )
  .then((res) => {
    console.log("Connected to DataBase");
  })
  .catch((err) => {
    console.log("err");
  });

console.log("App.js File");
app.use(express.json());
app.use(bodyParser.json());
app.use("/user", userRoute);
app.use("/category", catRoute);
// app.use("comment", commentRoute);
app.use("/blog", blogRoute);
app.use("*", (req, res) => {
  res.status(404).json({
    msg: "Bad Request",
  });
});
module.exports = app;
//  66b2a4b32f62e85aa3a1b17c

// {

//     "title": "News Blogs",
//     "UserId": "66b2a4b32f62e85aa3a1b17c",
//     "ImageUrl": "Dummy URL",
// }
