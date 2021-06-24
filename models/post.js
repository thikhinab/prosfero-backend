const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true
    },
    requests: {
      type: Array,
      required: false
    }
  },
  { 
    collections: 'posts',
    timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema)