/**
 * Business Rules API — payment system business rules.
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/", async (req, res, next) => {
  try {
    const { rule_type, feature_id, severity } = req.query;
    let query = db("feature_business_rules").orderBy("rule_name");
    if (rule_type) query = query.where("rule_type", rule_type);
    if (feature_id) query = query.where("feature_id", feature_id);
    if (severity) query = query.where("severity", severity);
    const rules = await query;
    res.json(rules);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const rule = await db("feature_business_rules").where("id", req.params.id).first();
    if (!rule) return res.status(404).json({ error: "Rule not found" });
    res.json(rule);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
