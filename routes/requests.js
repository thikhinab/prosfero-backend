const router = require("express").Router();
const User = require('../models/User');
const Post = require("../models/post");
const Request = require("../models/request");

//CREATE REQUEST
//ISN"T USED
// router.post("/:id", async (req, res) => {
//   const postid = req.params.id;
//   const userid = req.user.id;
//   const text = req.body.text;

//   try {
//     const response = await Request.create({
//       postid,
//       userid,
//       text
//   });

//   res.status(200).json(response);

//   } catch (err) {
//     res.status(500).json(err);
//     console.log(err);
//   }
// });

module.exports = router