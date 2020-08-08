const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose;
db.url = require("../config").DB_URL
db.user = require("./user.model.js")(mongoose)
db.room = require("./room.model.js")(mongoose)
db.message = require("./message.model.js")(mongoose)

module.exports = db