const user = require("../controllers/user.controller.js")

const router = require('express').Router()

router.post('/signup', user.SIGNUP)
router.post('/login', user.LOGIN)
router.get('/', user.SEARCH)
router.post('/join', user.JOIN_ROOM)
router.post('/leave', user.LEAVE_ROOM)

module.exports = app => { app.use('/users', router) }