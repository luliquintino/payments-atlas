/**
 * Knowledge Graph Service — builds and queries the payment knowledge graph.
 * The graph connects features, problems, actors, rails, and metrics
 * through typed relationships (depends_on, solves, causes, impacts).
 */

class PaymentKnowledgeGraph {
  constructor(db) {
    this.db = db;
    this.graph = { nodes: [], edges: [] };
  }

  /**
   * Loads the full knowledge graph from the database.
   * Nodes: features, problems, actors, rails, metrics
   * Edges: dependencies, solutions, impacts
   */
  async load() {
    const [features, problems, actors, rails, metrics, dependencies] =
      await Promise.all([
        this.db("payment_features").select("id", "name", "layer", "category"),
        this.db("problems").select("id", "name", "category", "severity"),
        this.db("actors").select("id", "name", "type"),
        this.db("payment_rails").select("id", "name", "type"),
        this.db("metrics").select("id", "name", "category"),
        this.db("feature_dependencies").select("*"),
      ]);

    this.graph.nodes = [
      ...features.map((f) => ({ ...f, nodeType: "feature" })),
      ...problems.map((p) => ({ ...p, nodeType: "problem" })),
      ...actors.map((a) => ({ ...a, nodeType: "actor" })),
      ...rails.map((r) => ({ ...r, nodeType: "rail" })),
      ...metrics.map((m) => ({ ...m, nodeType: "metric" })),
    ];

    this.graph.edges = dependencies.map((d) => ({
      source: d.source_feature_id,
      target: d.target_feature_id,
      type: d.relationship_type,
      strength: d.strength,
    }));

    return this.graph;
  }

  /**
   * Finds all nodes connected to a given node (direct neighbors).
   */
  getNeighbors(nodeId) {
    const outgoing = this.graph.edges
      .filter((e) => e.source === nodeId)
      .map((e) => ({
        node: this.graph.nodes.find((n) => n.id === e.target),
        relationship: e.type,
        direction: "outgoing",
      }));

    const incoming = this.graph.edges
      .filter((e) => e.target === nodeId)
      .map((e) => ({
        node: this.graph.nodes.find((n) => n.id === e.source),
        relationship: e.type,
        direction: "incoming",
      }));

    return [...outgoing, ...incoming].filter((n) => n.node);
  }

  /**
   * Finds the shortest path between two nodes using BFS.
   */
  findPath(startId, endId) {
    const visited = new Set();
    const queue = [[startId]];

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === endId) {
        return path.map((id) => this.graph.nodes.find((n) => n.id === id));
      }

      if (visited.has(current)) continue;
      visited.add(current);

      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node.id)) {
          queue.push([...path, neighbor.node.id]);
        }
      }
    }

    return null; // No path found
  }

  /**
   * Returns features that solve a specific problem.
   * Traverses the graph from problem → solutions → features.
   */
  async getFeaturesForProblem(problemId) {
    const solutions = await this.db("solutions")
      .where("problem_id", problemId)
      .select("features_required");

    const featureNames = solutions.flatMap((s) => s.features_required || []);
    return this.db("payment_features").whereIn("name", featureNames);
  }

  /**
   * Returns all problems that a feature helps solve.
   */
  async getProblemsForFeature(featureId) {
    const feature = await this.db("payment_features")
      .where("id", featureId)
      .first();
    if (!feature || !feature.problems_solved) return [];

    return this.db("problems").whereIn("name", feature.problems_solved);
  }

  /**
   * Returns the full dependency chain for a feature (transitive closure).
   */
  async getDependencyChain(featureId, visited = new Set()) {
    if (visited.has(featureId)) return [];
    visited.add(featureId);

    const deps = await this.db("feature_dependencies")
      .where("source_feature_id", featureId)
      .where("relationship_type", "depends_on");

    const chain = [];
    for (const dep of deps) {
      const feature = await this.db("payment_features")
        .where("id", dep.target_feature_id)
        .first();
      if (feature) {
        chain.push(feature);
        const subDeps = await this.getDependencyChain(
          dep.target_feature_id,
          visited
        );
        chain.push(...subDeps);
      }
    }

    return chain;
  }

  /**
   * Returns graph statistics.
   */
  getStats() {
    const nodesByType = {};
    for (const node of this.graph.nodes) {
      nodesByType[node.nodeType] = (nodesByType[node.nodeType] || 0) + 1;
    }

    const edgesByType = {};
    for (const edge of this.graph.edges) {
      edgesByType[edge.type] = (edgesByType[edge.type] || 0) + 1;
    }

    return {
      totalNodes: this.graph.nodes.length,
      totalEdges: this.graph.edges.length,
      nodesByType,
      edgesByType,
    };
  }
}

module.exports = PaymentKnowledgeGraph;
