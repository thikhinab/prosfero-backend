const router =  require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
let User = require('../models/user')


// Register User
router.route('/register').post( async (req, res) => {
    const rand = 55
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const username = req.body.username
    const email = req.body.email
    const plainTextPassword = req.body.password

    const password = await bcrypt.hash(plainTextPassword, 10)

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
        console.log(error)

        // Throw or handle
    }

    res.json({status: 'ok'})
})


// login
router.route('/login').post(async (req, res) => {

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
})

module.exports = router