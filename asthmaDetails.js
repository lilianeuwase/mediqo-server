const mongoose = require("mongoose");

const AsthmaDetailsScehma = new mongoose.Schema(
  {

    asthma_severity: Array,

    consultations: Number,

    //Profile
    fname: String,
    lname: String,
    age: Number,
    gender: String,
    height: Array,
    weight: Array,
    phone_number: { type: Number, unique: true },

    //Lab results
    RR: Array,
    creatinine: Array,

    chronic_cough: Array,

    confusion: Array,
    tachycardia: Array,
    wheez: Array,
    sighing: Array,
    expiratory_time: Array,
    clubb: Array,
    cyanosis: Array,
    hiv: Array,

    //Complications
    prego: Array,

    //Danger Signs
    broken: Array,
  },
  {
    collection: "AsthmaInfo",
  }
);

mongoose.model("AsthmaInfo", AsthmaDetailsScehma);