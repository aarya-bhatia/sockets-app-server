const room = require("../controllers/room.controller.js")
const { default: router } = require("../../client/src/router/index.js")

const router = require('express').Router()

router.post('/fetch', room.FETCH_ROOMS) // fetch rooms by id
router.post('/create', room.CREATE_ROOM) // create room
router.post('/:room_id/fetch', room.FETCH_MESSAGES) // fetch messages of room
router.post('/:room_id/send', room.SEND_MESSAGE) // send a message to room

module.exports = (app) => {
    app.use('/rooms', router)
}
