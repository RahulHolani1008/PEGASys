const config = require("./dev.json");
const mongoose = require("mongoose");
const db = config.mongoURI;

exports.connectDB = async () => {
  await mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("MongoDB Connected!");
    })
    .catch((err) => {
      console.error(err);
    });
};
