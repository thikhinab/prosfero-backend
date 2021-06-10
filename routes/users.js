const router =  require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
let User = require('../models/user')


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

    res.status('200').json({status: 'ok'})
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


router.route('/login').post(
    async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if (err || !user) {
              const error = new Error('An error occurred.');
  
              return next(error);
            }
  
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);
  
                const body = { id: user._id, username: user.username };
                const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
  
                return res.json({ token });
              }
            );
          } catch (error) {
            return next(error);
          }
        }
      )(req, res, next);
    }
  );

module.exports = router