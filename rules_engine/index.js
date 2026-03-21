/**
 * Rules Engine — evaluates business rules and diagnosis rules against input data.
 * Used by the Diagnosis Engine to match payment problems based on operational parameters.
 *
 * Rule format:
 * {
 *   conditions: [
 *     { field: "approval_rate", operator: "lt", value: 80 },
 *     { field: "has_3ds", operator: "eq", value: false }
 *   ],
 *   problem_id: "uuid",
 *   confidence: 85,
 *   explanation: "Low approval rate without 3DS suggests..."
 * }
 */

class RulesEngine {
  constructor() {
    this.rules = [];
  }

  /**
   * Loads rules from the database.
   */
  async loadRules(db) {
    this.rules = await db("diagnosis_rules").orderBy("priority", "desc");
    return this.rules;
  }

  /**
   * Evaluates all rules against the given input and returns matching rules.
   */
  evaluate(input) {
    const matches = [];

    for (const rule of this.rules) {
      const result = this.evaluateRule(rule, input);
      if (result.matched) {
        matches.push({
          rule_id: rule.id,
          rule_name: rule.rule_name,
          problem_id: rule.problem_id,
          confidence: rule.confidence,
          explanation: rule.explanation,
          matched_conditions: result.matchedConditions,
        });
      }
    }

    // Sort by confidence descending
    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Evaluates a single rule against input.
   */
  evaluateRule(rule, input) {
    const conditions = rule.conditions;
    if (!conditions || !Array.isArray(conditions)) {
      return { matched: false, matchedConditions: [] };
    }

    const matchedConditions = [];
    let allMatched = true;

    for (const condition of conditions) {
      const value = this.resolveField(input, condition.field);
      const matched = this.evaluateCondition(value, condition.operator, condition.value);

      if (matched) {
        matchedConditions.push(condition);
      } else {
        allMatched = false;
        break;
      }
    }

    return { matched: allMatched, matchedConditions };
  }

  /**
   * Resolves a field value from input, supporting dot notation (e.g., "metrics.auth_rate").
   */
  resolveField(input, field) {
    return field.split(".").reduce((obj, key) => obj?.[key], input);
  }

  /**
   * Evaluates a single condition.
   */
  evaluateCondition(value, operator, expected) {
    if (value === undefined || value === null) return false;

    switch (operator) {
      case "eq":
        return value === expected;
      case "not_eq":
        return value !== expected;
      case "gt":
        return Number(value) > Number(expected);
      case "gte":
        return Number(value) >= Number(expected);
      case "lt":
        return Number(value) < Number(expected);
      case "lte":
        return Number(value) <= Number(expected);
      case "in":
        return Array.isArray(expected) && expected.includes(value);
      case "not_in":
        return Array.isArray(expected) && !expected.includes(value);
      case "contains":
        return String(value).toLowerCase().includes(String(expected).toLowerCase());
      case "starts_with":
        return String(value).toLowerCase().startsWith(String(expected).toLowerCase());
      case "between":
        return (
          Array.isArray(expected) &&
          expected.length === 2 &&
          Number(value) >= Number(expected[0]) &&
          Number(value) <= Number(expected[1])
        );
      case "exists":
        return value !== undefined && value !== null;
      case "is_empty":
        return !value || (Array.isArray(value) && value.length === 0);
      default:
        return false;
    }
  }
}

module.exports = RulesEngine;
