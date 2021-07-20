const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/post");
const Request = require("../models/request");
const Categories = require("../models/botCategories")
const bot = require("../telebot");


//CREATE POST
router.post("/", async (req, res) => {
  const title = req.body.title;
  const desc = req.body.desc;
  const userid = req.user.id;
  const category = req.body.category;
  const image = req.body.image;
  try {
    const response = await Post.create({
      title,
      desc,
      userid,
      category,
      image,
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { noOfPosts: 1 },
      },
      { new: true }
    );

    var level = user.noOfPosts;
    if (level > 20) {
      level = "Generous Giver";
    } else if (level > 15) {
      level = "Pro";
    } else if (level > 10) {
      level = "Intermediate";
    } else if (level > 5) {
      level = "Beginner";
    } else {
      level = "Newbie";
    }

    const user2 = await User.findByIdAndUpdate(req.user.id, {
      $set: {
        achievementLevel: level,
        //{ $cond: [ { $gte: [ "$noOfPosts", 5 ] }, "Pro", "Newbie" ] }
      },
    });
    //console.log(user)

    let userList = await Categories.findOne({"category": category}, 
    function(err) {
        if (err) {
            console.log(err)
        }
    });
    userList = userList.users
    userList.forEach(function (chatid) {
      bot.sendMessage(chatid, `A new item has been posted in ${category}. Go check it out at ...` )
  });

    const { _id } = response._doc;
    res.status(200).json({ id: _id });
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
        const user = await User.findByIdAndUpdate(
          req.user.id,
          {
            $inc: { noOfPosts: -1 },
          },
          { new: true }
        );
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

// GET LIMITED NUMBER OF POSTS
router.get("/limited/:limit/:skip", async (req, res) => {
  const skip = parseInt(req.params.skip) || 0;
  const limit = parseInt(req.params.limit) || 0;

  const getPost = async (post) => {
    const { userid, title, desc, _id, createdAt, image } = post._doc;
    const user = await User.findById(userid);
    const { username, ...rest } = user._doc;
    const newPost = { id: _id, title, desc, createdAt, image, username };
    return newPost;
  };

  try {
    const posts = await Post.find().limit(limit).skip(skip).sort("-createdAt");

    Promise.all(
      posts.map((post) => {
        return getPost(post);
      })
    ).then((data) => res.status(200).json(data));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//MAKE REQUEST
router.post("/requests/:id", async (req, res) => {
  const postid = req.params.id;
  const userid = req.user.id;
  const text = req.body.text || "";

  try {
    const post = await Post.findById(postid);
    // console.log("post: ", postid)
    // console.log("post: ", post)
    // console.log("userid: ", userid)

    if (post.userid === req.user.id) {
      res.status(401).json("You cannot request your own post");
    } else {
      const count = await Request.countDocuments(
        {
          postid: postid,
          userid: userid,
        },
        (err, count) => {
          if (err) {
            console.log(err);
          } else {
            return count;
          }
        }
      );

      if (count !== 0) {
        res.status(401).json("You have already made a request on this post");
      } else {
        const newRequest = await Request.create({
          postid,
          userid,
          text,
        });

        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $push: { requests: newRequest.id },
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
