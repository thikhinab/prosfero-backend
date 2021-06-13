const router =  require('express').Router()
let UserModel = require('../models/User')
require('../auth/auth')



// Get User Profile
router.get('/', async (req, res) => {

    try {
        const user = await UserModel.findById(req.user.id).lean()
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(404).json({message: "User not found"})
    }
  })

module.exports = router