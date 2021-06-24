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
    photo: {
      type: String,
      required: false,
    },
    userid: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
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