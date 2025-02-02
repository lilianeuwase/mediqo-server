const mongoose = require("mongoose");

const HyperDetailsScehma = new mongoose.Schema(
  {
    //Initialize
    consultations: Number,
    control: Array,
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

    //Lab results
    systobp: Array,
    diastobp: Array,
    creatinine: Array,
    hyperkalemia_reslts: Array,

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

    //Doctor Comment
    doctor_comment: Array,

    //Vital Signs
    temp: Array,
    HR: Array,
    O2: Array,
    RR: Array,

    //Status
    Appointment: Date,
    Status: Boolean,
  },
  {
    collection: "HyperInfo",
  }
);

mongoose.model("HyperInfo", HyperDetailsScehma);
