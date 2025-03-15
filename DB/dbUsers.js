// dbUsers.js
const mongoose = require("mongoose");

const mongoUrlUsers =
  "mongodb+srv://alfagason:Bituke00..@login.yay2xvf.mongodb.net/users?retryWrites=true&w=majority";

const usersDb = mongoose.createConnection(mongoUrlUsers, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

usersDb.on("connected", () => {
  console.log("Connected to Users Database");
});

usersDb.on("error", (err) => {
  console.log("Users Database connection error:", err);
});

module.exports = usersDb;