const router =  require('express').Router()
const jwt = require('jsonwebtoken')
let UserModel = require('../models/user')
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
        const response = await User.create({
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


// login
/* router.route('/login').post(async (req, res) => {

    const { username, password } = req.body

    const user = await User.findOne({username}).lean()

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid username/password'})
    }

    if (await bcrypt.compare(password, user.password)) {

        const token = jwt.sign({
            id: user._id, 
            username: user.username},
            process.env.JWT_SECRET)

        return res.json({status: 'ok', token: token})
    }


    return res.json({ status: 'error', error: 'Invalid username/password'})
}) */


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
                const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {expiresIn: '1d'});
  
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


router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json({user: req.user})
})

module.exports = router