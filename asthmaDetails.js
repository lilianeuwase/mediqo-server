const mongoose = require("mongoose");

const AsthmaDetailsScehma = new mongoose.Schema(
  {
    asthma_severity: Array,

    consultations: Number,
    dates: Array,

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

    //Complications
    // prego: Array,
    // wheez: Array,
    // expiratory_time: Array,
    // clubb: Array,
    // cyanosis: Array,

    //Emergency Signs
    acute_dyspnea: Array,
    sighing: Array,
    broken: Array,
    tachy_brady: Array,
    confusion: Array,
    tachycardia: Array,
    bradycardia: Array,

    //Co-morbidities
    hiv: Array,
    reflux: Array,
    hist: Array,
    allergies: Array,
    heart: Array,
    hypoxia: Array,
  },
  {
    collection: "AsthmaInfo",
  }
);

mongoose.model("AsthmaInfo", AsthmaDetailsScehma);
