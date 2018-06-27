const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("categories", CategorySchema);
