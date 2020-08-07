module.exports = mongoose => {
    return mongoose.model('Room', 
    mongoose.Schema(
        {
        name: String,
        admin: String,
        members: [String],
        }, 
        { 
            timestamps: true
        }
    ))
}

