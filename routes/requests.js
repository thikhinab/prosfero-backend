const router = require("express").Router();
const User = require('../models/User');
const Post = require("../models/post");
const Request = require("../models/request");
const { request } = require("express");

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

//GET REQUESTS RECIEVED DATA FOR A USER
router.get("/", async (req, res) => {
    const userid = req.user.id;
  
    try {
      const posts = await Post.find({ 'userid': userid });
      const requests = []
      posts.forEach(function (post) {
        requests.push(...post.requests)
    });

    const getData = async (requestid)=>{
      const requestData = await Request.findById(requestid);
      const userData = await User.findById(requestData.userid);
      const username = userData.username;
      const postData = await Post.findById(requestData.postid);
      const postTitle = await postData.title
      return [postTitle, username, requestData.text]
    }

    const reqsData = []
    for ( const requestid of requests) {
      const data = await getData(requestid)
      reqsData.push(data)
    }
    res.status(200).json(reqsData)
    } catch (err) {
        console.log(err)
    }
  });

//GET REQUESTS MADE DATA FOR A USER
router.post("/", async (req, res) => {
  const userid = req.user.id;

  try {
    const requests = await Request.find({ 'userid': userid })
    const getData = async (request)=>{
      const post = await Post.findById(request.postid)
      const title = post.title
      const date = request.updatedAt
      const text = request.text
      return [title, date, text]
    }

    const reqsData = []
    for ( const request of requests) {
      const data = await getData(request)
      reqsData.push(data)
    }
    res.status(200).json(reqsData)
  } catch (err) {
      console.log(err)
  }
});

//GET REQUEST
router.get("/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router