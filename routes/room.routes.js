const room = require("../controllers/room.controller.js")
const router = require('express').Router()

router.post('/fetch', room.FETCH_ROOMS) // fetch rooms by id
router.post('/create', room.CREATE_ROOM) // create room

module.exports = (app) => {
    app.use('/rooms', router)
}
