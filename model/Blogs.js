const mongoose = require("mongoose");

const BlogsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  UserId: { type: String, required: true },
  ImageUrl: { type: String, required: true },
  BlogTitle: { type: String, required: true },
  BlogContent: { type: String, required: true },
  BlogCatogery: { type: String, required: true },
  CatogeryID: { type: String, required: true },
});

module.exports = mongoose.model("Blogs", BlogsSchema);
