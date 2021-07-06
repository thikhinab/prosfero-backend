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
      required: false,
    },
    requests: {
      type: Array,
      required: false,
    },
  },
  {
    collections: "posts",
    timestamps: true,
  }
);

PostSchema.index({ title: "text", desc: "text", category: "text" });

module.exports = mongoose.model("Post", PostSchema);
