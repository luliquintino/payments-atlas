/**
 * Problems API — CRUD for known payment problems and their solutions.
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET /api/problems — list all problems
router.get("/", async (req, res, next) => {
  try {
    const { category, severity, layer, search } = req.query;
    let query = db("problems").orderBy("severity", "desc").orderBy("name");

    if (category) query = query.where("category", category);
    if (severity) query = query.where("severity", severity);
    if (layer) query = query.where("layer", layer);
    if (search) query = query.where("name", "ilike", `%${search}%`);

    const problems = await query;
    res.json(problems);
  } catch (err) {
    next(err);
  }
});

// GET /api/problems/:id — get problem with solutions
router.get("/:id", async (req, res, next) => {
  try {
    const problem = await db("problems").where("id", req.params.id).first();
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const solutions = await db("solutions").where("problem_id", req.params.id);
    res.json({ ...problem, solutions });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
