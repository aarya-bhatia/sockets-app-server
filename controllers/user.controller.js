const db = require('../models')
const User = db.user

exports.SIGNUP = async (req, res, next) => {
    const { username, password } = req.body

    const user = new User({ username, password })
    try {
        await user.save()
        res.status(200).send(user)
    }
    catch (err) {
        next(err)
    }
}

exports.LOGIN = async (req, res, next) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        if (user.password !== password) {
            res.status(400).send({ message: 'Password is incorrect' })
        } else {
            res.status(200).send(user)
        }
    } catch (err) { next(err) }
}

exports.SEARCH = async (req, res, next) => {
    try {
        const users = await User.find({ "username": { "$regex": req.query.search, "$options": "i" } })
        res.status(200).send(users)
    } catch (err) {
        next(err)
    }
}

exports.JOIN_ROOM = async (req, res, next) => {
    const room = req.body
    try {
        await User.update({
            "username": {
                $in: room.members
            }
        },
            {
                $push: {
                    rooms: room
                }
            },
            {
                multi: true
            }
        )

        res.status(200).send()
    } catch (err) {
        next(err)
    }
}

exports.LEAVE_ROOM = async (req, res, next) => {
    const { user, room } = req.body
    try {
        await User.updateOne({
            "username": user
        },
            {
                $pull: {
                    rooms: room
                }
            }
        )

        res.status(200).send()
    } catch (err) {
        next(err)
    }
}