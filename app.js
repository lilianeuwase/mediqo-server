const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const mongoUrl =
  "mongodb+srv://alfagason:Bituke00..@login.yay2xvf.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./patDetails");
require("./imageDetails");
require("./hyperDetails");

const User = mongoose.model("UserInfo");
const Images = mongoose.model("ImageDetails");
const Patient = mongoose.model("PatInfo");
const HyperPatient = mongoose.model("HyperInfo");

//User Registration
app.post("/register", async (req, res) => {
  const { fname, lname, email, phone, title, hospital, password, userType } =
    req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      phone,
      title,
      hospital,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

//User Login
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "120m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});

//User Data
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

app.listen(5000, () => {
  console.log("Server Started");
});

//Forgot Password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "20m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adarsh438tcsckandivali@gmail.com",
        pass: "rmdklolcsmswvyfw",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "thedebugarena@gmail.com",
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) {}
});

//Reset Password
app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});
app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

//Get All User
app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

//Delete User
app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

//Upload Image
app.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64 });
    res.send({ Status: "ok" });
  } catch (error) {
    res.send({ Status: "error", data: error });
  }
});

//Get image
app.get("/get-image", async (req, res) => {
  try {
    await Images.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});

//Paginate Users
app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;

  const results = {};
  results.totalUser = allUser.length;
  results.pageCount = Math.ceil(allUser.length / limit);

  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    };
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results);
});

//Diabetes Patients
//Patient Registration
app.post("/registerPatient", async (req, res) => {
  const {
    consultations,
    //Profile
    fname,
    lname,
    age,
    gender,
    height,
    weight,
    bmi,
    phone_number,

    //Classical Symptoms
    polyuria,
    polydipsia,
    polyphagia,

    //Danger signs
    hydra,
    abspain,
    hypo,
    sighing,
    confusion,

    //Lab results
    glucose,
    fastglucose,
    hb,
    creatinine,

    //Complications
    retino,
    nephro,
    neuro,
    footulcer,

    //Co-mobidity
    hiv,
    htn,
    liver,
    prego,

    //results
    diagnosis,
    medication,
    patient_manage,
  } = req.body;

  try {
    const oldPatient = await Patient.findOne({ phone_number });

    if (oldPatient) {
      return res.json({ error: "Patient Exists" });
    }
    await Patient.create({
      consultations,
      //Profile
      fname,
      lname,
      age,
      gender,
      height,
      weight,
      bmi,
      phone_number,

      //Classical Symptoms
      polyuria,
      polydipsia,
      polyphagia,

      //Danger signs
      hydra,
      abspain,
      hypo,
      sighing,
      confusion,

      //Lab results
      glucose,
      fastglucose,
      hb,
      creatinine,

      //Complications
      retino,
      nephro,
      neuro,
      footulcer,

      //Co-mobidity
      hiv,
      htn,
      liver,
      prego,

      //results
      diagnosis,
      medication,
      patient_manage,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

//Update Patient
app.post("/updatePatient", async (req, res) => {
  const {
    phone_number,

    //Profile
    consultations,
    height,
    weight,
    bmi,

    //Lab Resultd
    glucose,
    hb,
    fastglucose,
    creatinine,

    //Danger signs
    hydra,
    abspain,
    hypo,
    sighing,
    confusion,

    //Complications
    retino,
    nephro,
    neuro,
    footulcer,

    //Co-mobidity
    hiv,
    htn,
    liver,
    prego,
  } = req.body;

  try {
    await Patient.updateOne(
      { phone_number: phone_number },
      {
        consultations: consultations,

        $push: {
          //Profile
          height: height,
          weight: weight,
          bmi: bmi,

          //Lab Resultd
          glucose: glucose,
          hb: hb,
          fastglucose: fastglucose,
          creatinine: creatinine,

          //Danger signs
          hydra: hydra,
          abspain: abspain,
          hypo: hypo,
          sighing: sighing,
          confusion: confusion,

          //Complications
          retino: retino,
          nephro: nephro,
          neuro: neuro,
          footulcer: footulcer,

          //Co-mobidity
          hiv: hiv,
          htn: htn,
          liver: liver,
          prego: prego,
        },
      }
    );
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

//Update Patient 1
app.post("/updatePatient1", async (req, res) => {
  const { phone_number, diagnosis, patient_manage, medication } = req.body;

  try {
    await Patient.updateOne(
      { phone_number: phone_number },
      {
        $push: {
          diagnosis: diagnosis,
          patient_manage: patient_manage,
          medication: medication,
        },
      }
    );
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

//Patient Retrieval
app.post("/login-patient", async (req, res) => {
  const { phone_number, lname } = req.body;

  const patient = await Patient.findOne({ phone_number });
  if (!patient) {
    return res.json({ error: "Patient Not found" });
  }
  // if (await Buffer.compare(lname, patient.lname)) {
  if (lname === patient.lname) {
    const token = jwt.sign({ phone_number: patient.phone_number }, JWT_SECRET, {
      expiresIn: "120m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid Last Name" });
});

//Patients Data
app.post("/patientData", async (req, res) => {
  const { token } = req.body;
  try {
    const patient = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(patient);
    if (patient == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const patientphone = patient.phone_number;
    Patient.findOne({ phone_number: patientphone })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

//Paginate Patients
app.get("/paginatedPatients", async (req, res) => {
  const allPatient = await Patient.find({});
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

//Get All Patient
app.get("/getAllPatient", async (req, res) => {
  try {
    const allPatient = await Patient.find({});
    res.send({ status: "ok", data: allPatient });
  } catch (error) {
    console.log(error);
  }
});

//Delete Patient
app.post("/deletePatient", async (req, res) => {
  const { patientid } = req.body;
  try {
    Patient.deleteOne({ _id: patientid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

//One Patient
app.get("/onePatientData", async (req, res) => {
  const patientphone = req.body;
  try {
    Patient.findOne({ phone_number: patientphone })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});
// app.get("/get-image", async (req, res) => {
//   try {
//     await Images.find({}).then((data) => {
//       res.send({ status: "ok", data: data });
//     });
//   } catch (error) {}
// });

//Hypertension Patients
//Hyper Patient Registration
app.post("/registerHyperPatient", async (req, res) => {
  const {
    //Initialize
    consultations,

    //Profile
    fname,
    lname,
    age,
    gender,
    height,
    weight,
    bmi,
    phone_number,

    //Lab results
    systobp,
    diastobp,
    creatinine,

    hyper_stage,

    //Danger Signs
    confusion,
    vision,
    sighing,
    chest_pain,
    smoke,
    diabetes,
    proteinuria,

    //Complications
    bradycardia,
    hyperkalemia,
    prego,
    hiv,

    //results
    diagnosis,
    medication,
    patient_manage,
  } = req.body;

  try {
    const oldHyperPatient = await HyperPatient.findOne({ phone_number });

    if (oldHyperPatient) {
      return res.json({ error: "Patient Exists" });
    }
    await HyperPatient.create({
      //Initialize
      consultations,

      //Profile
      fname,
      lname,
      age,
      gender,
      height,
      weight,
      bmi,
      phone_number,

      //Lab results
      systobp,
      diastobp,
      creatinine,

      hyper_stage,

      //Danger Signs
      confusion,
      vision,
      sighing,
      chest_pain,
      smoke,
      diabetes,
      proteinuria,

      //Complications
      bradycardia,
      hyperkalemia,
      prego,
      hiv,

      //results
      diagnosis,
      medication,
      patient_manage,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

//Update Hyper Patient
app.post("/updateHyperPatient", async (req, res) => {
  const {
    phone_number,

    //Profile
    consultations,
    height,
    weight,
    bmi,

    //Lab Results
    systobp,
    diastobp,
    creatinine,

    //Danger signs
    confusion,
    vision,
    sighing,
    chest_pain,
    smoke,
    diabetes,
    proteinuria,

    //Complications
    bradycardia,
    hyperkalemia,
    prego,
    hiv,
  } = req.body;

  try {
    await HyperPatient.updateOne(
      { phone_number: phone_number },
      {
        consultations: consultations,

        $push: {
          //Profile
          height: height,
          weight: weight,
          bmi: bmi,

          //Lab Resultd
          systobp: systobp,
          diastobp: diastobp,
          creatinine: creatinine,

          //Danger signs
          confusion: confusion,
          vision: vision,
          sighing: sighing,
          chest_pain: chest_pain,
          smoke: smoke,
          diabetes: diabetes,
          proteinuria: proteinuria,

          //Complications
          bradycardia: bradycardia,
          hyperkalemia: hyperkalemia,
          prego: prego,
          hiv: hiv,
        },
      }
    );
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

//Hyper Update Patient 1
app.post("/updateHyperPatient1", async (req, res) => {
  const { phone_number, diagnosis, patient_manage, medication, hyper_stage, control } = req.body;

  try {
    await HyperPatient.updateOne(
      { phone_number: phone_number },
      {
        $push: {
          diagnosis: diagnosis,
          patient_manage: patient_manage,
          medication: medication,
          hyper_stage:hyper_stage,
          control:control,
        },
      }
    );
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

//Hyper Patient Retrieval
app.post("/login-Hyperpatient", async (req, res) => {
  const { phone_number, lname } = req.body;

  const Hyperpatient = await HyperPatient.findOne({ phone_number });
  if (!Hyperpatient) {
    return res.json({ error: "Patient Not found" });
  }
  if (lname === Hyperpatient.lname) {
    const token = jwt.sign({ phone_number: Hyperpatient.phone_number }, JWT_SECRET, {
      expiresIn: "120m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid Last Name" });
});

//Hyper Patients Data
app.post("/hyperpatientData", async (req, res) => {
  const { token } = req.body;
  try {
    const Hyperpatient = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(Hyperpatient);
    if (Hyperpatient == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const Hyperpatientphone = Hyperpatient.phone_number;
    HyperPatient.findOne({ phone_number: Hyperpatientphone })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

//Hyper Paginate Patients
app.get("/paginatedHyperPatients", async (req, res) => {
  const allHyperPatient = await HyperPatient.find({});
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;

  const results = {};
  results.totalHyperPatient = allHyperPatient.length;
  results.pageCount = Math.ceil(allHyperPatient.length / limit);

  if (lastIndex < allHyperPatient.length) {
    results.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    };
  }
  results.result = allHyperPatient.slice(startIndex, lastIndex);
  res.json(results);
});

//Get All Patient
app.get("/getAllHyperPatient", async (req, res) => {
  try {
    const allHyperPatient = await HyperPatient.find({});
    res.send({ status: "ok", data: allHyperPatient });
  } catch (error) {
    console.log(error);
  }
});

//Delete Patient
app.post("/deleteHyperPatient", async (req, res) => {
  const { Hyperpatientid } = req.body;
  try {
    HyperPatient.deleteOne({ _id: Hyperpatientid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

//One Patient
app.get("/oneHyperPatientData", async (req, res) => {
  const Hyperpatientphone = req.body;
  try {
    HyperPatient.findOne({ phone_number: Hyperpatientphone })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});