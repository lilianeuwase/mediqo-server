const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const User = require("./userDetails");

// ====================
// USER ENDPOINTS
// ====================

// User Registration
router.post("/register", async (req, res) => {
  const {
    fname,
    lname,
    email,
    phone,
    speciality,
    hospital,
    password,
    userType,
  } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.json({ error: "Email already used" });
    }

    // Check if phone number already exists
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.json({ error: "Number already used" });
    }

    // Create the user in the database
    const newUser = await User.create({
      fname,
      lname,
      email,
      phone,
      speciality,
      hospital,
      password: encryptedPassword,
      userType,
    });

    const uniqueID = newUser.uniqueID;

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "alfagason@gmail.com",
        pass: "zczouxirwjxltpdb",
      },
    });

    const mailOptions = {
      from: "alfagason@gmail.com",
      to: email,
      subject: "Welcome to Mediqo - Your Registration Details",
      text: `Hello ${fname},\n\nYou have been successfully registered on Mediqo.\n\nHere are your login details:\nUnique ID: ${uniqueID}\nPassword: (The password you set during registration)\n\nPlease keep this information secure.\n\nRegards,\nMediqo Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          status: "error",
          message:
            "User registered but email not sent. Please check the server logs for details.",
        });
      } else {
        res.status(200).json({
          status: "ok",
          message: `User registered and email sent successfully! Unique ID: ${uniqueID}`,
        });
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong during registration. Please try again.",
    });
  }
});

// USER LOGIN
router.post("/login-user", async (req, res) => {
  const { uniqueID, password } = req.body;
  const user = await User.findOne({ uniqueID: uniqueID });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ uniqueID: user.uniqueID }, JWT_SECRET, {
      expiresIn: "1440m",
    });
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid Password" });
});

// Get User Data
router.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return "token expired";
      }
      return decoded;
    });
    if (decoded === "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }
    const uniqueID = decoded.uniqueID;
    User.findOne({ uniqueID: uniqueID })
      .then((data) => res.send({ status: "ok", data: data }))
      .catch((error) => res.send({ status: "error", data: error }));
  } catch (error) {
    console.error(error);
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
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
    const link = `https://fantastic-python.cyclic.app/reset-password/${oldUser._id}/${token}`;
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
  } catch (error) {
    console.error(error);
  }
});

// Reset Password (GET)
router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.error(error);
    res.send("Not Verified");
  }
});

// Reset Password (POST)
router.post("/reset-password/:id/:token", async (req, res) => {
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
      { _id: id },
      { $set: { password: encryptedPassword } }
    );
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.error(error);
    res.json({ status: "Something Went Wrong" });
  }
});

// Get All Users
router.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.error(error);
  }
});

// Delete User
router.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    await User.deleteOne({ _id: userid });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.error(error);
  }
});

// Paginate Users
router.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;
  const results = {};
  results.totalUser = allUser.length;
  results.pageCount = Math.ceil(allUser.length / limit);
  if (lastIndex < allUser.length) {
    results.next = { page: page + 1 };
  }
  if (startIndex > 0) {
    results.prev = { page: page - 1 };
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results);
});

module.exports = router;