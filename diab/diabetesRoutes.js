const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const Diabetes = require("./diabDetails");

// ====================
// DIABETES PATIENT ENDPOINTS
// ====================

// This endpoint returns paginated diabetes patient records.
//Paginate Patients
router.get("/paginatedDiabPatients", async (req, res) => {
  const allPatient = await Diabetes.find({});
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;

  const results = {};
  results.totalPatient = allPatient.length;
  results.pageCount = Math.ceil(allPatient.length / limit);

  if (lastIndex < allPatient.length) {
    results.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    };
  }
  results.result = allPatient.slice(startIndex, lastIndex);
  res.json(results);
});

//Get Diab Patient
router.post("/getDiabPatient", async (req, res) => {
  const { identifier } = req.body;
  
  // Search for the patient using phone_number, ID, or uniqueID
  const patient = await Diabetes.findOne({
    $or: [
      { phone_number: identifier },
      { ID: identifier },
      { uniqueID: identifier },
    ],
  });
  
  if (!patient) {
    return res.json({ error: "Patient Not found" });
  }
  
  const token = jwt.sign({ id: patient.uniqueID }, JWT_SECRET, {
    expiresIn: "1200m",
  });
  
  if (res.status(201)) {
    return res.json({ status: "ok", data: token });
  } else {
    return res.json({ error: "error" });
  }
});

//Diab Patient Data
// Endpoint to get Diabetes Patient Data
router.post("/diabPatientData", async (req, res) => {
  // Extract token and identifierType from the request body
  // identifierType can be "uniqueID", "phone_number", or "ID"
  const { token, identifierType } = req.body;

  try {
    // Verify the JWT token; the callback returns either an error or the decoded token.
    const decoded = jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return "token expired";
      }
      return decodedToken;
    });

    // If the token is expired or invalid, return an error response.
    if (decoded === "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    // Assume the token includes the patient identifier in the "id" field.
    const patientIdentifier = decoded.id;

    // Build the query based on the provided identifier type.
    let query = {};
    if (identifierType === "phone_number") {
      query = { phone_number: patientIdentifier };
    } else if (identifierType === "ID") {
      query = { ID: patientIdentifier };
    } else {
      // Defaults to uniqueID if identifierType is not provided or does not match.
      query = { uniqueID: patientIdentifier };
    }

    // Query the database for the patient data.
    Diabetes.findOne(query)
      .then((data) => {
        if (data) {
          res.send({ status: "ok", data: data });
        } else {
          res.send({ status: "error", data: "No patient data found" });
        }
      })
      .catch((error) => res.send({ status: "error", data: error }));
  } catch (error) {
    console.error("Error in /diabPatientData:", error);
    res.send({ status: "error", data: error.message });
  }
});



// Register Patient Profile
router.post("/registerDiabPatientProfile", async (req, res) => {
  const {
    fname,
    lname,
    DOB,
    gender,
    ID,
    phone_number,
    full_address,
    age,
    consultations,
    registerDate,
    doctor_name,
    hospital,
    bmi,
  } = req.body;
  
  try {
    const oldPatient = await Diabetes.findOne({ phone_number });
    if (oldPatient) {
      return res.json({ error: "Patient Exists" });
    }
    
    await Diabetes.create({
      fname,
      lname,
      DOB,
      gender,
      ID,
      phone_number,
      full_address,
      age,
      consultations,
      registerDate,
      doctor_name,
      hospital,
      userType: "DiabPatient",
    });
    
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error registering patient profile:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Register Patient Vital Signs
router.post("/registerDiabPatientVitalSigns", async (req, res) => {
  const { phone_number, vitalsDates, height, weight, bmi, temp, BP, HR, RR, O2 } = req.body;
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    patient.vitalsDates.push(vitalsDates);
    patient.height.push(height);
    patient.weight.push(weight);
    patient.bmi.push(bmi);
    patient.temp.push(temp);
    patient.BP.push(BP);
    patient.HR.push(HR);
    patient.RR.push(RR);
    patient.O2.push(O2);

    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error registering patient vital signs:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Edit Patient Vital Signs
router.post("/editDiabPatientVitalSigns", async (req, res) => {
  const { phone_number, recordIndex, vitalsDates, height, weight, bmi, temp, BP, HR, RR, O2 } = req.body;
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    if (recordIndex < 0 || recordIndex >= patient.vitalsDates.length) {
      return res.json({ error: "Invalid record index" });
    }
    patient.vitalsDates[recordIndex] = vitalsDates;
    patient.height[recordIndex] = height;
    patient.weight[recordIndex] = weight;
    patient.bmi[recordIndex] = bmi;
    patient.temp[recordIndex] = temp;
    patient.BP[recordIndex] = BP;
    patient.HR[recordIndex] = HR;
    patient.RR[recordIndex] = RR;
    patient.O2[recordIndex] = O2;

    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error updating patient vital signs:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Delete Patient Vital Signs
router.post("/deleteDiabPatientVitalSigns", async (req, res) => {
  const { phone_number, recordIndex } = req.body;
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    if (recordIndex < 0 || recordIndex >= patient.vitalsDates.length) {
      return res.json({ error: "Invalid record index" });
    }
    patient.vitalsDates.splice(recordIndex, 1);
    patient.height.splice(recordIndex, 1);
    patient.weight.splice(recordIndex, 1);
    patient.bmi.splice(recordIndex, 1);
    patient.temp.splice(recordIndex, 1);
    patient.BP.splice(recordIndex, 1);
    patient.HR.splice(recordIndex, 1);
    patient.RR.splice(recordIndex, 1);
    patient.O2.splice(recordIndex, 1);

    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error deleting patient vital signs:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Register Patient Lab Results
router.post("/registerDiabPatientLabResults", async (req, res) => {
  const { phone_number, labDates, glucose, fastglucose, hb, creatinine, moreLab } = req.body;
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    patient.labDates.push(labDates);
    patient.glucose.push(glucose);
    patient.fastglucose.push(fastglucose);
    patient.hb.push(hb);
    patient.creatinine.push(creatinine);
    patient.moreLab = patient.moreLab.concat(moreLab);

    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error registering patient lab results:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Edit Patient Lab Results
router.post("/editDiabPatientLabResults", async (req, res) => {
  const { phone_number, recordIndex, labDates, glucose, fastglucose, hb, creatinine, moreLab } = req.body;
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    if (recordIndex < 0 || recordIndex >= patient.labDates.length) {
      return res.json({ error: "Invalid record index" });
    }
    patient.labDates[recordIndex] = labDates;
    patient.glucose[recordIndex] = glucose;
    patient.fastglucose[recordIndex] = fastglucose;
    patient.hb[recordIndex] = hb;
    patient.creatinine[recordIndex] = creatinine;
    patient.moreLab[recordIndex] = moreLab;

    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error updating patient lab results:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Delete Patient Lab Results
router.post("/deleteDiabPatientLabResults", async (req, res) => {
  const { phone_number, recordIndex } = req.body;
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    if (recordIndex < 0 || recordIndex >= patient.labDates.length) {
      return res.json({ error: "Invalid record index" });
    }
    patient.labDates.splice(recordIndex, 1);
    patient.glucose.splice(recordIndex, 1);
    patient.fastglucose.splice(recordIndex, 1);
    patient.hb.splice(recordIndex, 1);
    patient.creatinine.splice(recordIndex, 1);
    patient.moreLab.splice(recordIndex, 1);

    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error deleting patient lab results:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Register Patient Additional Info
router.post("/registerDiabPatientAdditionalInfo", async (req, res) => {
  const {
    phone_number,
    doctorDates,
    clinicalSymp,
    dangerSigns,
    complications,
    comorbidities,
    doctor_comment,
  } = req.body;
  
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    patient.doctorDates.push(doctorDates);
    patient.clinicalSymp.push(clinicalSymp);
    patient.dangerSigns.push(dangerSigns);
    patient.complications.push(complications);
    patient.comorbidities.push(comorbidities);
    patient.doctor_comment.push(doctor_comment);
    
    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error registering additional info:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Edit Patient Additional Info
router.post("/editDiabPatientAdditionalInfo", async (req, res) => {
  const {
    phone_number,
    recordIndex,
    doctorDates,
    clinicalSymp,
    dangerSigns,
    complications,
    comorbidities,
    doctor_comment,
  } = req.body;
  
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    if (recordIndex < 0 || recordIndex >= patient.doctorDates.length) {
      return res.json({ error: "Invalid record index" });
    }
    patient.doctorDates[recordIndex] = doctorDates;
    patient.clinicalSymp[recordIndex] = clinicalSymp;
    patient.dangerSigns[recordIndex] = dangerSigns;
    patient.complications[recordIndex] = complications;
    patient.comorbidities[recordIndex] = comorbidities;
    patient.doctor_comment[recordIndex] = doctor_comment;
    
    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error updating additional info:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Delete Patient Additional Info
router.post("/deleteDiabPatientAdditionalInfo", async (req, res) => {
  const { phone_number, recordIndex } = req.body;
  
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    if (recordIndex < 0 || recordIndex >= patient.doctorDates.length) {
      return res.json({ error: "Invalid record index" });
    }
    patient.doctorDates.splice(recordIndex, 1);
    patient.clinicalSymp.splice(recordIndex, 1);
    patient.dangerSigns.splice(recordIndex, 1);
    patient.complications.splice(recordIndex, 1);
    patient.comorbidities.splice(recordIndex, 1);
    patient.doctor_comment.splice(recordIndex, 1);
    
    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error deleting additional info:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Register Patient Requested Lab
router.post("/registerDiabRequestedLab", async (req, res) => {
  const { phone_number, requestLabsDates, requestLab } = req.body;
  
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    patient.requestLabsDates.push(requestLabsDates);
    patient.requestLab.push(requestLab);
    
    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error registering requested labs:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Edit Patient Requested Lab
router.post("/editDiabRequestedLab", async (req, res) => {
  const { phone_number, recordIndex, requestLabsDates, requestLab } = req.body;
  
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    if (recordIndex < 0 || recordIndex >= patient.requestLabsDates.length) {
      return res.json({ error: "Invalid record index" });
    }
    patient.requestLabsDates[recordIndex] = requestLabsDates;
    patient.requestLab[recordIndex] = requestLab;
    
    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error updating requested labs:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Delete Patient Requested Lab
router.post("/deleteDiabRequestedLab", async (req, res) => {
  const { phone_number, recordIndex } = req.body;
  
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    if (recordIndex < 0 || recordIndex >= patient.requestLabsDates.length) {
      return res.json({ error: "Invalid record index" });
    }
    patient.requestLabsDates.splice(recordIndex, 1);
    patient.requestLab.splice(recordIndex, 1);
    
    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error deleting requested labs:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Diabetes Patient Results API Route
router.post("/registerDiabResult", async (req, res) => {
  const { phone_number, consultations, diagnosis, patient_manage, medication, dosage, control, resultComment } = req.body;

  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    patient.diagnosis.push(diagnosis);
    patient.patient_manage.push(patient_manage);
    patient.medication.push(medication);
    // dosage is expected to be an array of 3 strings, e.g. ["METFORMIN", "500mg", "twice a day"]
    patient.dosage.push(dosage);
    patient.consultations = consultations; // Depending on your logic, you can push or update this field.
    patient.control.push(control);
    patient.resultComment.push(resultComment);
    
    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error registering diab results", error);
    res.send({ status: "error", error: error.message });
  }
});

// Edit Diab Result API
router.post("/editDiabResult", async (req, res) => {
  const { phone_number, recordIndex, patient_manage, medication, comment, dosage, resultComment } = req.body;
  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    // Validate record index against the results array (e.g., diagnosis array)
    if (recordIndex < 0 || recordIndex >= patient.diagnosis.length) {
      return res.json({ error: "Invalid record index" });
    }
    // Update editable fields
    patient.patient_manage[recordIndex] = patient_manage;
    patient.medication[recordIndex] = medication;
    patient.doctor_comment[recordIndex] = comment;
    // dosage is expected to be an array of 3 strings
    patient.dosage[recordIndex] = dosage;
    // resultComment is expected to be an array of strings
    patient.resultComment[recordIndex] = resultComment;

    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error updating Diab result:", error);
    res.send({ status: "error", error: error.message });
  }
});

// Diabetes Patient Results API Route
router.post("/registerDiabPatientAppointment", async (req, res) => {
  const { phone_number, appointment } = req.body;

  try {
    const patient = await Diabetes.findOne({ phone_number });
    if (!patient) {
      return res.json({ error: "Patient not found" });
    }
    patient.appointment.push(appointment);
    
    await patient.save();
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error registering appointment", error);
    res.send({ status: "error", error: error.message });
  }
});

module.exports = router;