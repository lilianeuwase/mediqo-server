// asthmaDetails.js
const mongoose = require("mongoose");
const patientsDb = require("../DB/dbPatients");

const AsthmaSchema = new mongoose.Schema(
  {
    // Consultation & Facility Details
    consultations: { type: Number, required: true, default: 1 },
    dates: { type: String, required: true },              // Date of consultation
    doctor_name: { type: String, required: true },          // Attending doctor's name
    hospital: { type: String, required: true },             // Hospital name
    userType: { type: String, required: true },

    // Profile Fields
    fname: { type: String, required: true },                // First name
    lname: { type: String, required: true },                // Last name
    age: { type: Number },                                  // Optional (can be computed from DOB)
    DOB: { type: String, required: true },                  // Date of birth
    ID: { type: String },                                   // Optional patient ID
    gender: { type: String, required: true },               // Gender
    height: { type: String, required: true },               // Height measurement
    weight: { type: String, required: true },               // Weight measurement
    bmi: { type: String },                                  // Optional (can be computed)
    phone_number: { type: String, required: true, unique: true },
    full_address: { type: String, required: true },

    // Lab Results
    RR: { type: String, required: true },                   // Respiratory rate
    creatinine: { type: String, required: true },           // Creatinine level
    chronic_cough: { type: Boolean, default: false },
    dyspnea: { type: Boolean, default: false },

    // Emergency Signs
    acute_dyspnea: { type: Boolean, default: false },
    sighing: { type: Boolean, default: false },
    broken: { type: Boolean, default: false },
    tachy_brady: { type: Boolean, default: false },
    confusion: { type: Boolean, default: false },
    tachycardia: { type: Boolean, default: false },
    bradycardia: { type: Boolean, default: false },
    hypoxia: { type: Boolean, default: false },

    // Co-morbidities
    hiv: { type: Boolean, default: false },
    reflux: { type: Boolean, default: false },
    hist: { type: Boolean, default: false },
    allergies: { type: Boolean, default: false },
    heart: { type: Boolean, default: false },

    // Results / Doctor Comment
    doctor_comment: { type: String, required: true },
    diagnosis: { type: String, required: true },
    patient_manage: { type: String },
    medication: { type: String },

    // Vital Signs
    temp: { type: String, required: true },
    HR: { type: String, required: true },
    BP: { type: String, required: true },
    O2: { type: String, required: true },

    // Status
    Appointment: { type: String, required: true },
    status: { type: String, required: true },

    // Unique ID Field (6 digits, starting with "43")
    uniqueID: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Pre-save hook to generate a uniqueID with prefix "43"
AsthmaSchema.pre("save", function (next) {
  if (!this.uniqueID) {
    const prefix = "43";
    const randomNumber = Math.floor(Math.random() * 10000);
    const paddedNumber = randomNumber.toString().padStart(4, "0");
    this.uniqueID = "MDQ-" + prefix + paddedNumber;
  }
  next();
});

module.exports = patientsDb.model("Asthma", AsthmaSchema);