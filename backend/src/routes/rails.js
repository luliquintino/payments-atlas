/**
 * Payment Rails API — cards, bank transfers, wallets, crypto, etc.
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/", async (req, res, next) => {
  try {
    const { type } = req.query;
    let query = db("payment_rails").orderBy("name");
    if (type) query = query.where("type", type);
    const rails = await query;
    res.json(rails);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const rail = await db("payment_rails").where("id", req.params.id).first();
    if (!rail) return res.status(404).json({ error: "Rail not found" });

    const flows = await db("transaction_flows").where("rail_id", req.params.id);
    res.json({ ...rail, flows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
