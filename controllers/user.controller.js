const db = require('../models')
const User = db.user

exports.SIGNUP = async (req, res) => {
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

exports.LOGIN = async (req, res) => {
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

exports.SEARCH = async (req, res) => {
    const { search } = req.body
    try {
        const users = await userModel.find({ "username": { "$regex": search, "$options": "i" } })
        res.status(200).send(users)
    } catch (err) {
        next(err)
    }
}