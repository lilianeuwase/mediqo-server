// userDetails.js
const mongoose = require("mongoose");
const usersDb = require("../DB/dbUsers");

const UserSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    speciality: { type: String},
    hospital: { type: String},
    password: { type: String, required: true },
    userType: { type: String, required: true },
    headShot: { type: String },
    // UniqueID field with a default value function
    uniqueID: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        let prefix = "";
        const lowerUserType = this.userType ? this.userType.toLowerCase() : "";
        if (lowerUserType === "admin" || lowerUserType === "super admin") {
          prefix = "0";
        } else if (lowerUserType === "physician" || lowerUserType === "doctor") {
          prefix = "1";
        } else if (lowerUserType === "nurse") {
          prefix = "2";
        } else if (lowerUserType === "laboratory technician") {
          prefix = "3";
        } else if (lowerUserType === "pharmacist") {
          prefix = "5";
        } else {
          prefix = "9"; // default if no match
        }
        // Generate a random 5-digit number (padded if needed)
        const randomNumber = Math.floor(Math.random() * 100000);
        const paddedNumber = randomNumber.toString().padStart(5, "0");
        return "MDQ-" + prefix + paddedNumber;
      },
    },
  },
  { timestamps: true }
);

module.exports = usersDb.model("UserInfo", UserSchema);