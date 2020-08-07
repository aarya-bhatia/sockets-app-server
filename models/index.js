const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose;
db.url = `mongodb+srv://admin-aarya:Test-123@cluster0-tq3ny.mongodb.net/SocketApp`;
db.user = require("./user.model.js")(mongoose)
db.room = require("./room.model.js")(mongoose)
db.message = require("./message.model.js")(mongoose)

module.exports = db