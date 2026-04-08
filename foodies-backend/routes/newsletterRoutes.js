// =============================================
// routes/newsletterRoutes.js
// =============================================
// Base path: /api/newsletter

const express = require("express");
const router = express.Router();
const { subscribe, getAllSubscribers } = require("../controllers/newsletterController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/subscribe", subscribe);
router.get("/subscribers", protect, adminOnly, getAllSubscribers);

module.exports = router;
