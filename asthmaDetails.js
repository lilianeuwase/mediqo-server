const mongoose = require("mongoose");

const AsthmaDetailsScehma = new mongoose.Schema(
  {
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
    hypoxia: Array,

    chronic_cough: Array,
    dyspnea: Array,

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

    //results
    diagnosis: Array,
    medication: Array,
    patient_manage: Array,

    //Doctor Comment
    doctor_comment: Array,

    //Vital Signs
    temp: Array,
    HR: Array,
    BP: Array,
    O2: Array,
  },
  {
    collection: "AsthmaInfo",
  }
);

mongoose.model("AsthmaInfo", AsthmaDetailsScehma);
