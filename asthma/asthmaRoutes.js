const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";
  
const Asthma = require("./asthmaDetails");

// ====================
// ASTHMA PATIENT ENDPOINTS
// ====================

// This endpoint returns paginated asthma patient records.
router.get("/paginatedAsthmaPatients", async (req, res) => {
  const allPatient = await Asthma.find({});
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


module.exports = router;