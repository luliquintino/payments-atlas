/**
 * Transaction Flows API — payment flow templates with steps.
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET /api/flows — list all transaction flows
router.get("/", async (req, res, next) => {
  try {
    const { flow_type } = req.query;
    let query = db("transaction_flows").orderBy("name");
    if (flow_type) query = query.where("flow_type", flow_type);

    const flows = await query;
    res.json(flows);
  } catch (err) {
    next(err);
  }
});

// GET /api/flows/:id — get flow with all steps
router.get("/:id", async (req, res, next) => {
  try {
    const flow = await db("transaction_flows").where("id", req.params.id).first();
    if (!flow) return res.status(404).json({ error: "Flow not found" });

    const steps = await db("transaction_steps")
      .where("flow_id", req.params.id)
      .orderBy("step_order");

    res.json({ ...flow, steps });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
