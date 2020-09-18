require("dotenv").config();
exports.URI = "mongodb://localhost:27017/ChatAppDB";
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
