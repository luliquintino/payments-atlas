/**
 * Initial database schema for Payments Atlas.
 * Creates all core tables for the payment knowledge system.
 */
exports.up = function (knex) {
  return knex.schema
    // Payment features — core knowledge entries (e.g. "3D Secure", "Network Tokenization")
    .createTable("payment_features", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.string("name").notNullable().unique();
      t.text("description");
      t.string("layer"); // experience, orchestration, processing, network, banking, settlement
      t.string("category"); // authentication, routing, tokenization, etc.
      t.specificType("actors", "text[]"); // who is involved
      t.specificType("metrics_impacted", "text[]"); // which metrics this feature affects
      t.specificType("problems_solved", "text[]"); // which problems this feature solves
      t.string("complexity"); // low, medium, high, critical
      t.jsonb("metadata").defaultTo("{}");
      t.timestamps(true, true);
    })

    // Feature dependencies — directed graph edges between features
    .createTable("feature_dependencies", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.uuid("source_feature_id").references("id").inTable("payment_features").onDelete("CASCADE");
      t.uuid("target_feature_id").references("id").inTable("payment_features").onDelete("CASCADE");
      t.string("relationship_type").notNullable(); // depends_on, enhances, conflicts_with, requires
      t.text("description");
      t.integer("strength").defaultTo(1); // 1-5 how strong the dependency is
      t.timestamps(true, true);
      t.unique(["source_feature_id", "target_feature_id", "relationship_type"]);
    })

    // Business rules — conditional logic governing payment behavior
    .createTable("feature_business_rules", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.uuid("feature_id").references("id").inTable("payment_features").onDelete("CASCADE");
      t.string("rule_name").notNullable();
      t.text("condition"); // when this rule applies
      t.text("expected_behavior"); // what should happen
      t.string("rule_type"); // validation, routing, risk, compliance, operational
      t.string("severity"); // info, warning, critical
      t.jsonb("metadata").defaultTo("{}");
      t.timestamps(true, true);
    })

    // Payment rails — card, bank transfer, wallet, crypto, etc.
    .createTable("payment_rails", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.string("name").notNullable().unique();
      t.text("description");
      t.string("type"); // card, bank_transfer, wallet, crypto, bnpl
      t.specificType("supported_currencies", "text[]");
      t.specificType("supported_countries", "text[]");
      t.jsonb("characteristics").defaultTo("{}"); // settlement_time, fees, limits, etc.
      t.specificType("actors", "text[]");
      t.timestamps(true, true);
    })

    // Transaction flows — end-to-end payment process templates
    .createTable("transaction_flows", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.string("name").notNullable().unique();
      t.text("description");
      t.string("flow_type"); // card_payment, pix, crossborder, ach, wallet, bnpl, marketplace, payout
      t.uuid("rail_id").references("id").inTable("payment_rails").onDelete("SET NULL");
      t.specificType("actors", "text[]");
      t.specificType("features_used", "text[]");
      t.jsonb("metadata").defaultTo("{}");
      t.timestamps(true, true);
    })

    // Transaction steps — individual steps within a flow
    .createTable("transaction_steps", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.uuid("flow_id").references("id").inTable("transaction_flows").onDelete("CASCADE");
      t.integer("step_order").notNullable();
      t.string("name").notNullable();
      t.text("description");
      t.string("actor"); // who performs this step
      t.string("step_type"); // request, validation, processing, response
      t.specificType("features_involved", "text[]");
      t.jsonb("metadata").defaultTo("{}");
      t.timestamps(true, true);
    })

    // Actors — entities in the payments ecosystem
    .createTable("actors", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.string("name").notNullable().unique();
      t.text("description");
      t.string("type"); // merchant, psp, acquirer, network, issuer, consumer, regulator, wallet_provider
      t.string("category"); // infrastructure, financial, technology, regulatory
      t.specificType("capabilities", "text[]");
      t.jsonb("metadata").defaultTo("{}");
      t.timestamps(true, true);
    })

    // Problems — known issues in payment systems
    .createTable("problems", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.string("name").notNullable();
      t.text("description");
      t.string("category"); // authorization, fraud, settlement, compliance, performance, integration
      t.string("severity"); // low, medium, high, critical
      t.string("layer"); // which layer this problem occurs at
      t.specificType("symptoms", "text[]");
      t.specificType("affected_metrics", "text[]");
      t.specificType("affected_rails", "text[]");
      t.specificType("root_causes", "text[]");
      t.jsonb("metadata").defaultTo("{}");
      t.timestamps(true, true);
    })

    // Solutions — ways to resolve problems
    .createTable("solutions", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.uuid("problem_id").references("id").inTable("problems").onDelete("CASCADE");
      t.string("name").notNullable();
      t.text("description");
      t.string("solution_type"); // feature, process, configuration, architectural
      t.specificType("features_required", "text[]");
      t.string("complexity"); // low, medium, high
      t.string("impact"); // low, medium, high
      t.text("implementation_notes");
      t.jsonb("metadata").defaultTo("{}");
      t.timestamps(true, true);
    })

    // Diagnosis rules — rules engine for problem diagnosis
    .createTable("diagnosis_rules", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.string("rule_name").notNullable();
      t.jsonb("conditions").notNullable(); // structured conditions to match
      t.uuid("problem_id").references("id").inTable("problems").onDelete("CASCADE");
      t.text("explanation"); // why this diagnosis was reached
      t.integer("confidence").defaultTo(80); // 0-100
      t.integer("priority").defaultTo(5); // 1-10
      t.timestamps(true, true);
    })

    // Scenarios — simulation scenarios
    .createTable("scenarios", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.string("name").notNullable();
      t.text("description");
      t.jsonb("current_architecture").defaultTo("{}");
      t.jsonb("proposed_changes").defaultTo("{}");
      t.jsonb("impact_analysis").defaultTo("{}");
      t.string("scenario_type"); // optimization, migration, greenfield
      t.timestamps(true, true);
    })

    // Metrics — payment performance metrics
    .createTable("metrics", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.string("name").notNullable().unique();
      t.text("description");
      t.string("category"); // success, fraud, settlement, performance, cost
      t.string("unit"); // percentage, currency, time, count
      t.uuid("parent_metric_id").references("id").inTable("metrics").onDelete("SET NULL");
      t.text("formula"); // how this metric is calculated
      t.specificType("affected_by_features", "text[]");
      t.jsonb("benchmarks").defaultTo("{}"); // industry benchmarks
      t.timestamps(true, true);
    })

    // Ecosystem players — companies and services in the payments ecosystem
    .createTable("ecosystem_players", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.string("name").notNullable();
      t.text("description");
      t.string("type"); // network, psp, acquirer, issuer, wallet, bnpl_provider, regulator
      t.string("category"); // global, regional, local
      t.specificType("supported_rails", "text[]");
      t.specificType("supported_countries", "text[]");
      t.specificType("key_features", "text[]");
      t.jsonb("metadata").defaultTo("{}");
      t.timestamps(true, true);
    })

    // Taxonomy — payment system classification
    .createTable("taxonomy", (t) => {
      t.uuid("id").primary().defaultTo(knex.fn.uuid());
      t.string("name").notNullable();
      t.text("description");
      t.uuid("parent_id").references("id").inTable("taxonomy").onDelete("SET NULL");
      t.string("level"); // domain, category, subcategory
      t.integer("sort_order").defaultTo(0);
      t.jsonb("metadata").defaultTo("{}");
      t.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("taxonomy")
    .dropTableIfExists("ecosystem_players")
    .dropTableIfExists("metrics")
    .dropTableIfExists("scenarios")
    .dropTableIfExists("diagnosis_rules")
    .dropTableIfExists("solutions")
    .dropTableIfExists("problems")
    .dropTableIfExists("actors")
    .dropTableIfExists("transaction_steps")
    .dropTableIfExists("transaction_flows")
    .dropTableIfExists("payment_rails")
    .dropTableIfExists("feature_business_rules")
    .dropTableIfExists("feature_dependencies")
    .dropTableIfExists("payment_features");
};
