const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  UserId: { type: String, required: true },
  ImageUrl: { type: String, required: true },
});

module.exports = mongoose.model("Category", CategorySchema);
