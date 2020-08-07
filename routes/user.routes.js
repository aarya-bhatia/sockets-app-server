const user = require("../controllers/user.controller.js")

const router = require('express').Router()

router.post('/signup', user.SIGNUP)
router.post('/login', user.LOGIN)
router.post('/search', user.SEARCH)

module.exports = app => { app.use('/users', router) }