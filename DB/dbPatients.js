// dbPatients.js
const mongoose = require("mongoose");

const mongoUrlPatients =
  "mongodb+srv://alfagason:Bituke00..@login.yay2xvf.mongodb.net/patients?retryWrites=true&w=majority";

const patientsDb = mongoose.createConnection(mongoUrlPatients, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

patientsDb.on("connected", () => {
  console.log("Connected to Patients Database");
});

patientsDb.on("error", (err) => {
  console.log("Patients Database connection error:", err);
});

module.exports = patientsDb;