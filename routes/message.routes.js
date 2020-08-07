const message = require("../controllers/message.controller.js")

const router = require('express').Router()

router.get('/:room_id', message.FETCH_MESSAGES)
router.post('/:room_id', message.SEND_MESSAGE)

module.exports = app => { app.use('/messages', router) }