const db = require('../models')
const Room = db.room

exports.FETCH_ROOMS = async (req, res, next) => {
    const rooms = req.body.rooms // id's
    try {
        const docs = await Room.find({ '_id': { $in: rooms } })

        res.status(200).send(docs)
    }
    catch (err) { next(err) }
}

exports.CREATE_ROOM = async (req, res, next) => {
    const room = new Room({
        ...req.body
    })
    try {
        await room.save()
        res.status(200).send(room)
    } catch (err) { next(err) }
}