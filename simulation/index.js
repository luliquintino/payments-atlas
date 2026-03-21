/**
 * Simulation Engine — calculates the projected impact of payment architecture changes.
 * Models how adding/removing features affects key payment metrics.
 *
 * Metrics modeled:
 * - Authorization rate
 * - Conversion rate
 * - Fraud rate
 * - Chargeback rate
 * - Settlement time
 * - Processing cost
 */

// Impact coefficients by feature category
const IMPACT_COEFFICIENTS = {
  authentication: {
    authorization_rate: 3.0,
    conversion_rate: -1.5, // friction reduces conversion
    fraud_rate: -0.5,
    chargeback_rate: -0.3,
  },
  tokenization: {
    authorization_rate: 4.5,
    conversion_rate: 1.5,
    fraud_rate: -0.3,
  },
  routing: {
    authorization_rate: 4.0,
    processing_cost_bps: -15,
    conversion_rate: 1.0,
  },
  retry: {
    authorization_rate: 3.5,
    conversion_rate: 2.0,
  },
  fraud_prevention: {
    fraud_rate: -0.8,
    chargeback_rate: -0.4,
    authorization_rate: -0.5, // may increase false declines
  },
  optimization: {
    conversion_rate: 3.0,
    processing_cost_bps: -10,
  },
  settlement: {
    settlement_time_hours: -8,
  },
  compliance: {
    authorization_rate: 1.0,
  },
  risk: {
    fraud_rate: -0.4,
    chargeback_rate: -0.2,
  },
  orchestration: {
    authorization_rate: 2.5,
    conversion_rate: 1.5,
    processing_cost_bps: -20,
  },
  processing: {
    authorization_rate: 1.5,
    conversion_rate: 0.5,
  },
  experience: {
    conversion_rate: 4.0,
  },
  recovery: {
    authorization_rate: 3.0,
    conversion_rate: 1.5,
  },
  reporting: {},
  integration: {
    conversion_rate: 0.5,
  },
};

// Regional modifiers — some features have more/less impact by region
const REGIONAL_MODIFIERS = {
  brazil: { authentication: 0.8, settlement: 1.5 }, // PIX makes settlement impact larger
  us: { routing: 1.2, fraud_prevention: 1.1 },
  europe: { authentication: 1.3, compliance: 1.5 }, // SCA increases auth impact
  apac: { experience: 1.3, tokenization: 0.9 },
  latam: { fraud_prevention: 1.3, routing: 1.1 },
};

class SimulationEngine {
  /**
   * Runs a full architecture simulation.
   * @param {Object} params
   * @param {Array} params.currentFeatures - currently active feature objects
   * @param {Array} params.proposedFeatures - features to add
   * @param {string} params.country - operating country/region
   * @param {number} params.volume - monthly transaction volume
   * @param {number} params.ticketSize - average transaction size
   */
  simulate({ currentFeatures = [], proposedFeatures = [], country, volume, ticketSize }) {
    const baseline = this.calculateMetrics(currentFeatures, country);
    const projected = this.calculateMetrics(
      [...currentFeatures, ...proposedFeatures],
      country
    );

    const impact = {};
    for (const key of Object.keys(baseline)) {
      const delta = +(projected[key] - baseline[key]).toFixed(2);
      impact[key] = {
        current: baseline[key],
        projected: projected[key],
        delta,
        delta_percent: baseline[key]
          ? +(((projected[key] - baseline[key]) / baseline[key]) * 100).toFixed(2)
          : 0,
      };
    }

    // Revenue impact estimation
    const monthlyRevenue = (volume || 10000) * (ticketSize || 50);
    const authImprovement = (impact.authorization_rate?.delta || 0) / 100;
    const conversionImprovement = (impact.conversion_rate?.delta || 0) / 100;
    const additionalRevenue = monthlyRevenue * (authImprovement + conversionImprovement);

    return {
      baseline,
      projected,
      impact,
      revenue_impact: {
        monthly_additional_revenue: Math.round(additionalRevenue),
        annual_additional_revenue: Math.round(additionalRevenue * 12),
      },
    };
  }

  calculateMetrics(features, country) {
    const metrics = {
      authorization_rate: 85,
      conversion_rate: 70,
      fraud_rate: 2.5,
      chargeback_rate: 1.0,
      settlement_time_hours: 48,
      processing_cost_bps: 250,
    };

    const region = this.getRegion(country);
    const regionMod = REGIONAL_MODIFIERS[region] || {};

    for (const feature of features) {
      const impacts = IMPACT_COEFFICIENTS[feature.category] || {};
      for (const [metric, delta] of Object.entries(impacts)) {
        const modifier = regionMod[feature.category] || 1.0;
        metrics[metric] = +(metrics[metric] + delta * modifier).toFixed(2);
      }
    }

    // Clamp values to realistic ranges
    metrics.authorization_rate = Math.min(99.5, Math.max(50, metrics.authorization_rate));
    metrics.conversion_rate = Math.min(99, Math.max(30, metrics.conversion_rate));
    metrics.fraud_rate = Math.max(0.05, metrics.fraud_rate);
    metrics.chargeback_rate = Math.max(0.02, metrics.chargeback_rate);
    metrics.settlement_time_hours = Math.max(0.1, metrics.settlement_time_hours);
    metrics.processing_cost_bps = Math.max(30, metrics.processing_cost_bps);

    return metrics;
  }

  getRegion(country) {
    const regionMap = {
      BR: "brazil",
      US: "us",
      GB: "europe",
      DE: "europe",
      FR: "europe",
      NL: "europe",
      ES: "europe",
      IT: "europe",
      MX: "latam",
      AR: "latam",
      CO: "latam",
      CL: "latam",
      JP: "apac",
      AU: "apac",
      SG: "apac",
      IN: "apac",
    };
    return regionMap[country] || "us";
  }
}

module.exports = SimulationEngine;
