/**
 * Features API — CRUD operations for payment features.
 * Payment features are the core knowledge units (e.g., "3D Secure", "Network Tokenization").
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET /api/features — list all features with optional filters
router.get("/", async (req, res, next) => {
  try {
    const { layer, category, complexity, search } = req.query;
    let query = db("payment_features").orderBy("name");

    if (layer) query = query.where("layer", layer);
    if (category) query = query.where("category", category);
    if (complexity) query = query.where("complexity", complexity);
    if (search) query = query.where("name", "ilike", `%${search}%`);

    const features = await query;
    res.json(features);
  } catch (err) {
    next(err);
  }
});

// GET /api/features/:id — get feature by ID with dependencies and rules
router.get("/:id", async (req, res, next) => {
  try {
    const feature = await db("payment_features").where("id", req.params.id).first();
    if (!feature) return res.status(404).json({ error: "Feature not found" });

    // Fetch related data
    const [dependencies, dependents, rules] = await Promise.all([
      db("feature_dependencies as fd")
        .join("payment_features as pf", "pf.id", "fd.target_feature_id")
        .where("fd.source_feature_id", req.params.id)
        .select("pf.id", "pf.name", "fd.relationship_type", "fd.strength"),
      db("feature_dependencies as fd")
        .join("payment_features as pf", "pf.id", "fd.source_feature_id")
        .where("fd.target_feature_id", req.params.id)
        .select("pf.id", "pf.name", "fd.relationship_type", "fd.strength"),
      db("feature_business_rules").where("feature_id", req.params.id),
    ]);

    res.json({ ...feature, dependencies, dependents, rules });
  } catch (err) {
    next(err);
  }
});

// GET /api/features/layers/summary — get features grouped by layer
router.get("/layers/summary", async (req, res, next) => {
  try {
    const layers = await db("payment_features")
      .select("layer")
      .count("* as count")
      .groupBy("layer")
      .orderBy("layer");
    res.json(layers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
