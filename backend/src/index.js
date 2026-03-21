/**
 * Payments Atlas — Backend API Server
 * Express server providing REST API for the payments knowledge system.
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const featuresRoutes = require("./routes/features");
const problemsRoutes = require("./routes/problems");
const flowsRoutes = require("./routes/flows");
const railsRoutes = require("./routes/rails");
const diagnoseRoutes = require("./routes/diagnose");
const simulateRoutes = require("./routes/simulate");
const rulesRoutes = require("./routes/rules");
const metricsRoutes = require("./routes/metrics");
const searchRoutes = require("./routes/search");
const taxonomyRoutes = require("./routes/taxonomy");
const ecosystemRoutes = require("./routes/ecosystem");
const advisorRoutes = require("./routes/advisor");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "payments-atlas-api" });
});

// API Routes
app.use("/api/features", featuresRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/flows", flowsRoutes);
app.use("/api/rails", railsRoutes);
app.use("/api/diagnose", diagnoseRoutes);
app.use("/api/simulate", simulateRoutes);
app.use("/api/rules", rulesRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/taxonomy", taxonomyRoutes);
app.use("/api/ecosystem", ecosystemRoutes);
app.use("/api/advisor", advisorRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error("API Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Payments Atlas API running on port ${PORT}`);
});

module.exports = app;
