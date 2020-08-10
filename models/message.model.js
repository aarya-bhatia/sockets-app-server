module.exports = mongoose => {
    return mongoose.model('Message',
        mongoose.Schema(
            {
                room: mongoose.Schema.Types.ObjectId,
                user: String,
                content: String,
                time: String
            },
            {
                timestamps: true
            }
        )
    )
}
