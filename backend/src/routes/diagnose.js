/**
 * Diagnosis API — combines rules engine + knowledge graph to diagnose payment problems.
 * Accepts operational parameters and returns matched problems with solutions.
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// POST /api/diagnose — run diagnosis engine
router.post("/", async (req, res, next) => {
  try {
    const input = req.body;
    // Fetch all diagnosis rules
    const rules = await db("diagnosis_rules").orderBy("priority", "desc");

    const matchedProblems = [];

    for (const rule of rules) {
      const match = evaluateRule(rule.conditions, input);
      if (match) {
        const problem = await db("problems").where("id", rule.problem_id).first();
        if (problem) {
          const solutions = await db("solutions").where("problem_id", problem.id);
          matchedProblems.push({
            problem,
            solutions,
            rule_name: rule.rule_name,
            confidence: rule.confidence,
            explanation: rule.explanation,
          });
        }
      }
    }

    // Sort by confidence descending
    matchedProblems.sort((a, b) => b.confidence - a.confidence);

    res.json({
      input,
      diagnosis: matchedProblems,
      total_problems_found: matchedProblems.length,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/diagnose/rules — list all diagnosis rules
router.get("/rules", async (req, res, next) => {
  try {
    const rules = await db("diagnosis_rules").orderBy("priority", "desc");
    res.json(rules);
  } catch (err) {
    next(err);
  }
});

/**
 * Evaluates a diagnosis rule against input parameters.
 * Supports operators: eq, gt, lt, gte, lte, in, contains
 */
function evaluateRule(conditions, input) {
  if (!conditions || !Array.isArray(conditions)) return false;

  return conditions.every((condition) => {
    const value = input[condition.field];
    if (value === undefined || value === null) return false;

    switch (condition.operator) {
      case "eq":
        return value === condition.value;
      case "gt":
        return Number(value) > Number(condition.value);
      case "lt":
        return Number(value) < Number(condition.value);
      case "gte":
        return Number(value) >= Number(condition.value);
      case "lte":
        return Number(value) <= Number(condition.value);
      case "in":
        return Array.isArray(condition.value) && condition.value.includes(value);
      case "contains":
        return String(value).toLowerCase().includes(String(condition.value).toLowerCase());
      case "not_eq":
        return value !== condition.value;
      default:
        return false;
    }
  });
}

module.exports = router;
