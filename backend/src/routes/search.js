/**
 * Global Search API — searches across features, problems, rails, and flows.
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET /api/search?q=query — global search
router.get("/", async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ results: [], query: q });
    }

    const pattern = `%${q}%`;

    const [features, problems, rails, flows] = await Promise.all([
      db("payment_features")
        .where("name", "ilike", pattern)
        .orWhere("description", "ilike", pattern)
        .limit(10)
        .select("id", "name", "description", "layer", "category"),
      db("problems")
        .where("name", "ilike", pattern)
        .orWhere("description", "ilike", pattern)
        .limit(10)
        .select("id", "name", "description", "category", "severity"),
      db("payment_rails")
        .where("name", "ilike", pattern)
        .orWhere("description", "ilike", pattern)
        .limit(5)
        .select("id", "name", "description", "type"),
      db("transaction_flows")
        .where("name", "ilike", pattern)
        .orWhere("description", "ilike", pattern)
        .limit(5)
        .select("id", "name", "description", "flow_type"),
    ]);

    res.json({
      query: q,
      results: [
        ...features.map((f) => ({ ...f, result_type: "feature" })),
        ...problems.map((p) => ({ ...p, result_type: "problem" })),
        ...rails.map((r) => ({ ...r, result_type: "rail" })),
        ...flows.map((f) => ({ ...f, result_type: "flow" })),
      ],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
