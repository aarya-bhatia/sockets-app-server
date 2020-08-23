module.exports = function (Schema) {
    return new Schema({
        members: [String],
        messages: [Object]
    });
}