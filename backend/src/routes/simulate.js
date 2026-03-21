/**
 * Simulation API — calculates impact of adding/removing features to a payment architecture.
 * Takes current architecture config and proposed changes, returns projected impact.
 */
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// POST /api/simulate — run payment architecture simulation
router.post("/", async (req, res, next) => {
  try {
    const {
      current_features = [],
      proposed_features = [],
      country,
      volume,
      ticket_size,
      payment_methods = [],
    } = req.body;

    // Fetch feature data for current and proposed features
    const [currentFeatureData, proposedFeatureData] = await Promise.all([
      db("payment_features").whereIn("name", current_features),
      db("payment_features").whereIn("name", proposed_features),
    ]);

    // Calculate current metrics baseline
    const currentMetrics = calculateMetrics(currentFeatureData, { country, volume, ticket_size });

    // Calculate projected metrics with proposed features
    const allFeatures = [...currentFeatureData, ...proposedFeatureData];
    const projectedMetrics = calculateMetrics(allFeatures, { country, volume, ticket_size });

    // Calculate impact delta
    const impact = {};
    for (const key of Object.keys(projectedMetrics)) {
      impact[key] = {
        current: currentMetrics[key],
        projected: projectedMetrics[key],
        delta: +(projectedMetrics[key] - currentMetrics[key]).toFixed(2),
        delta_percent: currentMetrics[key]
          ? +(((projectedMetrics[key] - currentMetrics[key]) / currentMetrics[key]) * 100).toFixed(2)
          : 0,
      };
    }

    // Check for missing dependencies
    const missingDeps = await findMissingDependencies(
      currentFeatureData.map((f) => f.id),
      proposedFeatureData.map((f) => f.id)
    );

    res.json({
      current_architecture: {
        features: currentFeatureData.map((f) => f.name),
        metrics: currentMetrics,
      },
      proposed_architecture: {
        features: allFeatures.map((f) => f.name),
        metrics: projectedMetrics,
      },
      impact,
      missing_dependencies: missingDeps,
      recommendations: generateRecommendations(impact, missingDeps),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/simulate/scenarios — list saved scenarios
router.get("/scenarios", async (req, res, next) => {
  try {
    const scenarios = await db("scenarios").orderBy("created_at", "desc");
    res.json(scenarios);
  } catch (err) {
    next(err);
  }
});

/**
 * Calculates projected payment metrics based on active features.
 * Each feature contributes to specific metrics based on its type.
 */
function calculateMetrics(features, context) {
  // Baseline metrics
  const metrics = {
    authorization_rate: 85,
    conversion_rate: 70,
    fraud_rate: 2.5,
    chargeback_rate: 1.0,
    settlement_time_hours: 48,
    processing_cost_bps: 250,
  };

  // Feature impact map — how each category of feature affects metrics
  const impactMap = {
    authentication: { authorization_rate: 3, fraud_rate: -0.5 },
    tokenization: { authorization_rate: 5, conversion_rate: 2, fraud_rate: -0.3 },
    routing: { authorization_rate: 4, processing_cost_bps: -15 },
    retry: { authorization_rate: 3, conversion_rate: 2 },
    fraud_prevention: { fraud_rate: -0.8, chargeback_rate: -0.3 },
    optimization: { conversion_rate: 3, processing_cost_bps: -10 },
    settlement: { settlement_time_hours: -8 },
    compliance: { authorization_rate: 1 },
    risk: { fraud_rate: -0.4, chargeback_rate: -0.2 },
    orchestration: { authorization_rate: 2, conversion_rate: 1, processing_cost_bps: -20 },
  };

  for (const feature of features) {
    const impacts = impactMap[feature.category] || {};
    for (const [metric, delta] of Object.entries(impacts)) {
      metrics[metric] = +(metrics[metric] + delta).toFixed(2);
    }
  }

  // Clamp values
  metrics.authorization_rate = Math.min(99.5, Math.max(0, metrics.authorization_rate));
  metrics.conversion_rate = Math.min(99, Math.max(0, metrics.conversion_rate));
  metrics.fraud_rate = Math.max(0.1, metrics.fraud_rate);
  metrics.chargeback_rate = Math.max(0.05, metrics.chargeback_rate);
  metrics.settlement_time_hours = Math.max(1, metrics.settlement_time_hours);
  metrics.processing_cost_bps = Math.max(50, metrics.processing_cost_bps);

  return metrics;
}

/**
 * Finds features required by proposed features that aren't in the current architecture.
 */
async function findMissingDependencies(currentIds, proposedIds) {
  const allIds = [...currentIds, ...proposedIds];
  const deps = await db("feature_dependencies")
    .whereIn("source_feature_id", proposedIds)
    .where("relationship_type", "depends_on");

  const missing = [];
  for (const dep of deps) {
    if (!allIds.includes(dep.target_feature_id)) {
      const feature = await db("payment_features").where("id", dep.target_feature_id).first();
      if (feature) missing.push(feature.name);
    }
  }
  return missing;
}

function generateRecommendations(impact, missingDeps) {
  const recs = [];
  if (impact.authorization_rate?.delta > 0) {
    recs.push(`Authorization rate improvement of +${impact.authorization_rate.delta}pp expected`);
  }
  if (impact.fraud_rate?.delta < 0) {
    recs.push(`Fraud reduction of ${impact.fraud_rate.delta}pp expected`);
  }
  if (missingDeps.length > 0) {
    recs.push(`Missing dependencies: ${missingDeps.join(", ")}. Add these for full benefit.`);
  }
  return recs;
}

module.exports = router;
