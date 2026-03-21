/**
 * Taxonomy API — payment system classification hierarchy.
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/", async (req, res, next) => {
  try {
    const { format } = req.query;
    const items = await db("taxonomy").orderBy("sort_order");

    if (format === "tree") {
      res.json(buildTree(items));
    } else {
      res.json(items);
    }
  } catch (err) {
    next(err);
  }
});

function buildTree(items) {
  const map = {};
  const roots = [];
  items.forEach((i) => (map[i.id] = { ...i, children: [] }));
  items.forEach((i) => {
    if (i.parent_id && map[i.parent_id]) {
      map[i.parent_id].children.push(map[i.id]);
    } else {
      roots.push(map[i.id]);
    }
  });
  return roots;
}

module.exports = router;
