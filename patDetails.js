const mongoose = require("mongoose");

const PatDetailsScehma = new mongoose.Schema(
  {
    //Initialize
    consultations: Number,
    dates: Array,
    
    //Profile
    fname: String,
    lname: String,
    age: Number,
    gender: String,
    height: Array,
    weight: Array,
    bmi: Array,
    phone_number: { type: Number, unique: true },

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
  },
  {
    collection: "PatInfo",
  }
);

mongoose.model("PatInfo", PatDetailsScehma);
