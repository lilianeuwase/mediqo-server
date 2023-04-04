const mongoose = require("mongoose");

const HyperDetailsScehma = new mongoose.Schema(
  {
    //Initialize
    consultations: Number,
    control: Array,

    //Profile
    fname: String,
    lname: String,
    age: Number,
    gender: String,
    height: Array,
    weight: Array,
    bmi: Array,
    phone_number: { type: Number, unique: true },

    //Lab results
    systobp: Array,
    diastobp: Array,
    creatinine: Array,

    hyper_stage: Array,

    //Danger Signs
    confusion: Array,
    vision: Array,
    sighing: Array,
    chest_pain: Array,
    smoke: Array,
    diabetes: Array,
    proteinuria: Array,

    //Complications
    bradycardia: Array,
    hyperkalemia: Array,
    prego: Array,
    hiv: Array,

   
    //results
    diagnosis: Array,
    medication: Array,
    patient_manage: Array,

  },
  {
    collection: "HyperInfo",
  }
);

mongoose.model("HyperInfo", HyperDetailsScehma);
