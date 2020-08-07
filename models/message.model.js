module.exports = mongoose => {
    return mongoose.model('Message',
        mongoose.Schema(
            {
                room_id: mongoose.Schema.Types.ObjectId,
                sender: String,
                content: String,
                time: String
            },
            {
                timestamps: true
            }
        )
    )
}
