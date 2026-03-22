/**
 * Tipos compartilhados para o Payments Knowledge System
 */

export type Layer =
  | "experience"
  | "orchestration"
  | "processing"
  | "network"
  | "banking"
  | "settlement";

export type Complexity = "low" | "medium" | "high" | "critical";

export interface PaymentFeature {
  id: string;
  name: string;
  description: string;
  layer: Layer;
  category: string;
  complexity: Complexity;
  actors: string[];
  metricsImpacted: string[];
  /** Aliases para busca (nomes em PT, EN, abreviações) */
  aliases?: string[];
  /** IDs de features das quais esta depende */
  dependencies?: string[];
  /** IDs de fluxos em que esta feature aparece */
  relatedFlows?: string[];
  /** IDs de problemas que esta feature ajuda a resolver */
  relatedProblems?: string[];
  /** Regras de negócio associadas */
  businessRules?: string[];
  /** Requisitos técnicos para implementação */
  technicalRequirements?: string[];
  /** Exemplo de payload JSON (string formatada) */
  payloadExample?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  layer: Layer;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  relationship: string;
}

export const ALL_LAYERS: Layer[] = [
  "experience",
  "orchestration",
  "processing",
  "network",
  "banking",
  "settlement",
];

export const LAYER_LABELS: Record<Layer, string> = {
  experience: "Experience",
  orchestration: "Orchestration",
  processing: "Processing",
  network: "Network",
  banking: "Banking",
  settlement: "Settlement",
};

export const LAYER_COLORS: Record<Layer, string> = {
  experience: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  orchestration: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  processing: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  network: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  banking: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  settlement: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

export const LAYER_NODE_COLORS: Record<Layer, { bg: string; border: string; text: string }> = {
  experience: { bg: "#dbeafe", border: "#1e3a5f", text: "#0f172a" },
  orchestration: { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
  processing: { bg: "#cffafe", border: "#06b6d4", text: "#155e75" },
  network: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
  banking: { bg: "#e0f2fe", border: "#0284c7", text: "#0c4a6e" },
  settlement: { bg: "#ffe4e6", border: "#f43f5e", text: "#9f1239" },
};

export const COMPLEXITY_LABELS: Record<Complexity, string> = {
  low: "baixa",
  medium: "média",
  high: "alta",
  critical: "crítica",
};

export const COMPLEXITY_COLORS: Record<Complexity, string> = {
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};
