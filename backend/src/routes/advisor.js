/**
 * AI Advisor API — LLM-powered payment advice endpoint.
 */
const express = require("express");
const router = express.Router();
const { queryLLM } = require("../services/llm");

// POST /api/advisor — ask a payment question
router.post("/", async (req, res, next) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const result = await queryLLM(message, context || {});
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
