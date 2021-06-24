const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    postid:{
        type: String,
        //required: true
    },
    userid: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    }
  },
  { 
    collections: 'requests',
    timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema)