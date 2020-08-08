module.exports = mongoose => {
    const user = mongoose.model('User', mongoose.Schema({
        username: {
            type: String,
            required: true
            //unique: true
        },
        password: {
            type: String,
            required: true
        },
        rooms: {
            type: [mongoose.Schema.Types.ObjectId],
            default: []
        }
    }))

    return user
}