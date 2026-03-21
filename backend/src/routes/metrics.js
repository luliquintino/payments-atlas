/**
 * Metrics API — payment performance metrics tree.
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET /api/metrics — list all metrics (flat or tree)
router.get("/", async (req, res, next) => {
  try {
    const { format } = req.query;
    const metrics = await db("metrics").orderBy("name");

    if (format === "tree") {
      res.json(buildMetricsTree(metrics));
    } else {
      res.json(metrics);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const metric = await db("metrics").where("id", req.params.id).first();
    if (!metric) return res.status(404).json({ error: "Metric not found" });

    const children = await db("metrics").where("parent_metric_id", req.params.id);
    res.json({ ...metric, children });
  } catch (err) {
    next(err);
  }
});

/**
 * Builds a hierarchical tree from flat metrics list.
 */
function buildMetricsTree(metrics) {
  const map = {};
  const roots = [];

  metrics.forEach((m) => {
    map[m.id] = { ...m, children: [] };
  });

  metrics.forEach((m) => {
    if (m.parent_metric_id && map[m.parent_metric_id]) {
      map[m.parent_metric_id].children.push(map[m.id]);
    } else {
      roots.push(map[m.id]);
    }
  });

  return roots;
}

module.exports = router;
