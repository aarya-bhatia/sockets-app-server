const express = require('express')
const router = express.Router()

const { User } = require('../models')

router.get('/', (req, res) => {
    res.send('OK')
})

router.post('/signup', function (req, res, next) {
    const { username, password } = req.body
    User.findOne({ username }, function (err, user) {
        if (err) return next(err)
        if (user) return res.status(400).send('username is taken!')
        // username is available
        const new_user = new User({ username, password })
        new_user.save(function (err) {
            if (err) return next(err)
            localStorage.setItem('user', JSON.stringify(new_user))
            return res.status(201).send()
        })
    })
})

router.post('/login', function (req, res, next) {
    const { username, password } = req.body
    User.findOne({ username }, { password: -1 }, function (err, user) {
        if (err) return next(err)
        if (!user) return res.status(404).send('username does not exist')
        if (user.password === password) {
            localStorage.setItem('user', JSON.stringify(user))
            return res.status(200).send()
        }
        else res.status(400).send('password is incorrect')
    })
})

router.post('/logout', function (req, res) {
    localStorage.clear()
    res.sendStatus(200)
})


//fix later...
// function generateToken(user) {
//     return jwt.sign({ data: user }, config_1.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
// }

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null)
//         return res.sendStatus(401);
//     jwt.verify(token, config_1.ACCESS_TOKEN_SECRET, function (err, user) {
//         if (err) {
//             return res.sendStatus(403);
//         }
//         next();
//     });
// }


module.exports = router