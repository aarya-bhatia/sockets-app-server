const db = require('../models')
const Message = db.message

// send message to a room
exports.SEND_MESSAGE = async (req, res, next) => {
    const { room_id } = req.params

    const message = new Message({
        room: room_id,
        ...req.body
    })

    try {
        await message.save()

        res.status(200).send(message)
    }
    catch (err) { next(err) }
}

// fetch messages for a room
exports.FETCH_MESSAGES = async (req, res, next) => {
    const { room_id } = req.params

    try {
        const messages = await Message.find({ room: room_id })
            .sort({ createdAt: -1 })
            .limit(100)

        res.status(200).send(messages)
    }
    catch (err) { next(err) }
}