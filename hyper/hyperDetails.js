// hyperDetails.js
const mongoose = require("mongoose");
const patientsDb = require("../DB/dbPatients");

const HyperSchema = new mongoose.Schema(
  {
    // Consultation & Facility Details
    consultations: { type: Number, required: true, default: 1 },
    dates: { type: String, required: true },              // Date of consultation
    doctor_name: { type: String, required: true },          // Attending doctor
    hospital: { type: String, required: true },             // Hospital name
    userType: { type: String, required: true },

    // Patient Profile
    fname: { type: String, required: true },                // First name
    lname: { type: String, required: true },                // Last name
    age: { type: Number },                                  // (Optional: can be computed from DOB)
    DOB: { type: String, required: true },                  // Date of birth
    ID: { type: String },                                   // Optional: patient’s national/other ID
    gender: { type: String, required: true },               // Gender
    height: { type: String, required: true },               // Height
    weight: { type: String, required: true },               // Weight
    bmi: { type: String },                                  // (Optional: can be computed)
    phone_number: { type: String, required: true, unique: true },
    full_address: { type: String, required: true },

    // Lab Results (for hypertension evaluation)
    systobp: { type: String, required: true },              // Systolic blood pressure
    diastobp: { type: String, required: true },             // Diastolic blood pressure
    creatinine: { type: String, required: true },
    hyperkalemia_reslts: { type: String, required: true },
    hyper_stage: { type: String, required: true },

    // Danger Signs (defaults provided; not required since absence implies "false")
    confusion: { type: Boolean, default: false },
    vision: { type: Boolean, default: false },
    sighing: { type: Boolean, default: false },
    chest_pain: { type: Boolean, default: false },
    smoke: { type: Boolean, default: false },
    diabetes: { type: Boolean, default: false },
    proteinuria: { type: Boolean, default: false },

    // Complications (optional; default to false)
    bradycardia: { type: Boolean, default: false },
    hyperkalemia: { type: Boolean, default: false },
    prego: { type: Boolean, default: false },
    hiv: { type: Boolean, default: false },

    // Results / Doctor Comment
    diagnosis: { type: String, required: true },
    medication: { type: String },
    patient_manage: { type: String },
    doctor_comment: { type: String, required: true },

    // Vital Signs
    temp: { type: String, required: true },
    HR: { type: String, required: true },
    O2: { type: String, required: true },
    RR: { type: String, required: true },

    // Status Information
    Appointment: { type: String, required: true },
    status: { type: String, required: true },
    control: { type: String },

    // Unique ID (automatically generated)
    uniqueID: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

// Pre-save hook to generate a 6-digit uniqueID starting with "42"
HyperSchema.pre("save", function (next) {
  if (!this.uniqueID) {
    const prefix = "42";
    const randomNumber = Math.floor(Math.random() * 10000);
    const paddedNumber = randomNumber.toString().padStart(4, "0");
    this.uniqueID = "MDQ-" + prefix + paddedNumber; 
  }
  next();
});

module.exports = patientsDb.model("Hypertension", HyperSchema);