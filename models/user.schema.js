module.exports = function (Schema) {
    const ObjectId = Schema.Types.ObjectId
    return new Schema({
        firstName: String,
        lastName: String,
        email: String,
        country: String,
        avatarUrl: String,
        gender: { type: String, enum: ["Male", "Female"] },
        username: { type: String, required: true, lowercase: true },
        password: { type: String, required: true, minLength: 6 },
        chatIds: [{ type: ObjectId }]
    });
}