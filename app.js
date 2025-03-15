const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mediqo.onrender.com",
      "https://mediqqotesting.netlify.app",
    ],
  })
);

// Import routes
const userRoutes = require("./user/userRoutes");
const diabetesRoutes = require("./diab/diabetesRoutes");
const hyperRoutes = require("./hyper/hyperRoutes");
const asthmaRoutes = require("./asthma/asthmaRoutes");

// Use the routes (all endpoints are mounted on "/")
app.use("/", userRoutes);
app.use("/", diabetesRoutes);
app.use("/", hyperRoutes);
app.use("/", asthmaRoutes);

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});