/**
 * Ecosystem API — payment ecosystem players (networks, PSPs, banks, wallets).
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/", async (req, res, next) => {
  try {
    const { type, category } = req.query;
    let query = db("ecosystem_players").orderBy("name");
    if (type) query = query.where("type", type);
    if (category) query = query.where("category", category);
    const players = await query;
    res.json(players);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const player = await db("ecosystem_players").where("id", req.params.id).first();
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json(player);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
