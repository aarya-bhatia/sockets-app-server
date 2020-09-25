module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      contacts: [],
      outgoing_requests: [],
      incoming_requests: [],
      country: {
        type: String,
        default: "NA",
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "NA"],
        default: "NA",
      },
      privacy: {
        type: String,
        enum: ["Public", "Private"],
        defualt: "Public",
      },
    },
    { timestamps: true }
  );
  return mongoose.model("User", userSchema);
};
