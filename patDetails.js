const mongoose = require("mongoose");

const PatDetailsScehma = new mongoose.Schema(
  {
    //Initialize
    consultations: Number,
    dates: Array,
    doctor_name: Array,
    hospital:  Array,

    //Profile
    fname: String,
    lname: String,
    age: Number,
    DOB: Date,
    gender: String,
    height: Array,
    weight: Array,
    bmi: Array,
    ID: { type: Number, unique: true },
    phone_number: { type: Number, unique: true },
    full_address: String,

    //Classical Symptoms
    polyuria: Boolean,
    polydipsia: Boolean,
    polyphagia: Boolean,

    //Danger signs
    hydra: Array,
    abspain: Array,
    hypo: Array,
    sighing: Array,
    confusion: Array,

    //Lab results
    glucose: Array,
    fastglucose: Array,
    hb: Array,
    creatinine: Array,

    //Complications
    retino: Array,
    nephro: Array,
    neuro: Array,
    footulcer: Array,

    //Co-mobidity
    hiv: Array,
    htn: Array,
    liver: Array,
    prego: Array,

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
    RR: Array,

    //Status
    Appointment: Date,
    Status: Boolean,
  },
  {
    collection: "PatInfo",
  }
);

mongoose.model("PatInfo", PatDetailsScehma);
