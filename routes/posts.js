const router = require("express").Router();
const User = require('../models/User');
const Post = require("../models/post");
const Request = require("../models/request");

//CREATE POST
router.post("/", async (req, res) => {
  const title = req.body.title;
  const desc = req.body.desc;
  const userid = req.user.id;
  try {
    const response = await Post.create({
      title,
      desc,
      userid
  });

  const user = await User.findByIdAndUpdate(req.user.id, {
      $inc: { noOfPosts: 1 }
}, {new: true});

var level = user.noOfPosts
if (level > 20) { level = "Generous Giver" } else 
if (level > 15) { level = "Pro"} else 
if (level> 10) { level = "Intermediate" } else 
if (level > 5) { level = "Beginner" } else
{level = "Newbie"}

const user2 = await User.findByIdAndUpdate(req.user.id, {
    $set : {
      achievementLevel: level
             //{ $cond: [ { $gte: [ "$noOfPosts", 5 ] }, "Pro", "Newbie" ] }
    }
})

/*
const user2 = await User.findByIdAndUpdate(req.user.id, 
  { $set : {
    achievementLevel:
  {
    $switch: {
       branches: [
          { case: { $gte: [ "$noOfPosts", 5 ] } , then: "Pro" },
          { case: false, then: "Newbie" }
       ],
       default: "Brand New"
    }
  }}
 }, {new: true})*/

  //console.log(user)
  res.status(200).json(response);

  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userid === req.user.id) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        const user = await User.findByIdAndUpdate(req.user.id, {
          $inc: { noOfPosts: -1 }
    }, {new: true});
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//MAKE REQUEST 
router.post("/requests/:id", async (req, res) => {
  try {
    const postid = req.params.id;
    const userid = req.user.id;
    const text = req.body.text;
    const newRequest = await Request.create({
      postid,
      userid,
      text
    });
    const post = await Post.findById(postid);

    function helperFunc(reqId) {
      const currReq = Request.findById(reqId);
      if (currReq.userid === req.user.id) {
        var proceed = false
      }
    }

    var proceed = true
    post.requests.forEach(helperFunc);
    if (proceed === false) {
      res.status(401).json("You have already made a request on this post");
    }

    if (post.userid != req.user.id) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $push: { requests: newRequest.id }
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You cannot request your own post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
