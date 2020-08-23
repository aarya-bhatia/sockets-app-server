const mongoose = require('mongoose');
const Schema = mongoose.Schema
module.exports.User = mongoose.model('User', require('./user.schema.js')(Schema));
module.exports.Message = mongoose.model('Message', require('./message.schema.js')(Schema));
module.exports.Chat = mongoose.model('Chat', require('./chat.schema.js')(Schema));