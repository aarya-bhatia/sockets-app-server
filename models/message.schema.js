module.exports = function (Schema) {
    const ObjectId = Schema.Types.ObjectId

    return new Schema({
        senderId: { type: ObjectId, required: true },
        senderAvatarUrl: { type: String, required: true },
        sender: { type: String, required: true },
        recieverId: { type: ObjectId, required: true },
        recieverAvatarUrl: { type: String, required: true },
        reciever: { type: String, required: true },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now },
        seen: { type: Boolean, default: false },
    });
}