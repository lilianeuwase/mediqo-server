// diabDetails.js
const mongoose = require("mongoose");
const patientsDb = require("../DB/dbPatients");

const DiabSchema = new mongoose.Schema(
  {
    consultations: { type: Number, required: true },
    registerDate: { type: String, required: true }, // Patient Registration date
    doctor_name: { type: [String], required: true }, // Attending doctor as an array
    hospital: { type: [String], required: true }, // Hospital name as an array
    userType: { type: String, required: true },

    // Profile fields
    fname: { type: String, required: true }, // First name
    lname: { type: String, required: true }, // Last name
    age: { type: Number }, // Optional (can be computed from DOB)
    DOB: { type: String, required: true }, // Date of birth
    gender: { type: String, required: true }, // Gender
    height: { type: [String] }, // Height (in meters, for example) as an array
    weight: { type: [String] }, // Weight (in kilograms, for example) as an array
    bmi: { type: [String] }, // BMI (can be computed) as an array
    ID: { type: String, required: true, unique: true }, // Optional (patient’s national/other ID)
    phone_number: { type: String, required: true, unique: true }, // Phone number (unique)
    full_address: { type: String, required: true }, // Full address

    // Vital Signs (converted to arrays)
    vitalsDates: { type: [String] }, // Consultation date as an array
    temp: { type: [String] }, // now an array for temp
    HR: { type: [String] }, // now an array for HR
    BP: { type: [String] }, // now an array for BP
    O2: { type: [String] }, // now an array for O2
    RR: { type: [String] }, // now an array for RR
    moreVitals: {
      type: [[String]],
      validate: (v) => v.every((arr) => arr.length === 2),
    },

    // Lab Results (converted to arrays)
    labDates: { type: [String] }, // Lab Results date as an array
    glucose: { type: [String] }, // now an array for GLUCOSE
    fastglucose: { type: [String] }, // now an array for FASTGLUCOSE
    hb: { type: [String] }, // now an array for hb
    creatinine: { type: [String] }, // now an array for creatinine
    requestLab: { type: [[String]] }, // now an array for requested lab results
    requestLabsDates: { type: [String] }, // Consultation date as an array
    moreLab: {
      type: [[[String]]],
      validate: (v) =>
        v.every(
          (dateGroup) =>
            Array.isArray(dateGroup) &&
            dateGroup.every((pair) => Array.isArray(pair) && pair.length === 2)
        ),
    },

    //Additional Info
    doctorDates: { type: [String] }, // Consultation date as an array
    doctor_comment: { type: [String] }, // now an array for doctor_comment
    // Array to store all clinical symptoms arrays (e.g., "polyuria", "polydipsia", "polyphagia")
    clinicalSymp: { type: [[String]] },

    // Array to store all danger signs arrays (e.g., "Dehydration", "Abdominal Pain", "Hypoglycemia", "Shortness of Breath", "confusion")
    dangerSigns: { type: [[String]] },

    // Array to store all complications arrays (e.g., "Retinopathy", "Nephropathy", "Neuropathy", "Foot Ulcer")
    complications: { type: [[String]] },

    // Array to store all co-morbidities arrays (e.g., "HIV", "Hypertension", "Liver Disease", "Pregnant")
    comorbidities: { type: [[String]] },

    // Results / Doctor Comment (converted to arrays)
    diagnosis: { type: [String] }, // now an array for diagnosis
    medication: { type: [String] }, // now an array for medication
    // *** Updated dosage field: an array of arrays of length 2 ***
    // Updated dosage field: now each entry is an array of 3 strings.
    dosage: {
      type: [[String]],
      validate: (v) => v.every((arr) => arr.length === 3),
    },
    patient_manage: { type: [String] }, // now an array for patient_manage
    control: { type: [String] }, //Diabetes control good or bad
    resultComment: { type: [String] }, // comment generated by system upon results

    // Status (converted to arrays)
    appointment: { type: [String] }, // now an array for Appointment
    status: { type: [String] }, // now an array for Status

    // uniqueID field processed with a default function
    // Previously generated via pre-save hook, now handled directly in the schema definition
    uniqueID: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        const prefix = "41"; // Fixed prefix for diabetes patients
        // Generate a random 4-digit number (to total 6 digits with the prefix)
        const randomNumber = Math.floor(Math.random() * 10000);
        const paddedNumber = randomNumber.toString().padStart(4, "0");
        return "MDQ-" + prefix + paddedNumber;
      },
    },
  },
  { timestamps: true }
);

module.exports = patientsDb.model("Diabetes", DiabSchema);
