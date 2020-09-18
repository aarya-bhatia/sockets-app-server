const { URI } = require("./config");

let db = {};

module.exports = (mongoose) => {
  db.User = require("./models/User")(mongoose);

  db.Chat = require("./models/Chat")(mongoose);

  db.run = function () {
    mongoose.connection.on("connected", function () {
      console.log("Successfully connected to database");
    });
    mongoose.connection.on("disconnected", function () {
      console.log("Disconnected from database");
    });
    mongoose.connection.on("error", function () {
      console.log("Error while connecting to database");
      process.exit();
    });

    process.on("SIGINT", function () {
      mongoose.connection.close(function () {
        console.log(
          "Mongoose default connection is disconnected due to application termination"
        );
        process.exit(0);
      });
    });

    mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  };

  return db;
};
