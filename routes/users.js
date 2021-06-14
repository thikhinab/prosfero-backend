const router =  require('express').Router()
const jwt = require('jsonwebtoken')
let UserModel = require('../models/User')
const passport = require('passport')
const { request } = require('express')
require('../auth/auth')


// Register User
router.route('/register').post( async (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    try {
        const response = await UserModel.create({
            firstName,
            lastName,
            username,
            email,
            password
        })
        console.log('User created sucessfully', response)
    } catch (error) {
        if (error.code = 11000) {
          res.status('409')
          if (error.keyPattern.username !== undefined) {
            console.log('I am here')
            return res.json({message: 'Username is already taken'})
          } else if (error.keyPattern.email !== undefined) {
            return res.json({message: 'Email is already taken'})
          }
        } else {
          throw error
        }
    }

    res.status('200').json({message: 'Account successfully created'})
})


// Login
router.route('/login').post( async (req, res) => {
      passport.authenticate('login',
        async (err, user, info) => {
          try {
            if (err) {
              
              return res.json({error: err});
            } else if (!user) {
              return res.json({error: 'Invalid username or password'})
            }
  
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return res.json(error);
  
                const body = { id: user._id, username: user.username };
                // Consider adding expiration
                const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
  
                return res.json({ message: info.message, token });
              }
            );
          } catch (error) {
            return res.json(error);
          }
        }
      )(req, res);
    }
  );


module.exports = router