/**
 * API client for Payments Atlas backend.
 * All API calls go through Next.js rewrites to the backend.
 */

const API_BASE = "/api";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || "API request failed");
  }
  return res.json();
}

// Features
export const getFeatures = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchAPI<any[]>(`/features${qs}`);
};
export const getFeature = (id: string) => fetchAPI<any>(`/features/${id}`);

// Problems
export const getProblems = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchAPI<any[]>(`/problems${qs}`);
};
export const getProblem = (id: string) => fetchAPI<any>(`/problems/${id}`);

// Flows
export const getFlows = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchAPI<any[]>(`/flows${qs}`);
};
export const getFlow = (id: string) => fetchAPI<any>(`/flows/${id}`);

// Rails
export const getRails = () => fetchAPI<any[]>("/rails");
export const getRail = (id: string) => fetchAPI<any>(`/rails/${id}`);

// Diagnosis
export const runDiagnosis = (input: Record<string, any>) =>
  fetchAPI<any>("/diagnose", { method: "POST", body: JSON.stringify(input) });

// Simulation
export const runSimulation = (input: Record<string, any>) =>
  fetchAPI<any>("/simulate", { method: "POST", body: JSON.stringify(input) });

// Metrics
export const getMetrics = (format?: string) =>
  fetchAPI<any[]>(`/metrics${format ? `?format=${format}` : ""}`);

// Search
export const globalSearch = (q: string) => fetchAPI<any>(`/search?q=${encodeURIComponent(q)}`);

// Business Rules
export const getRules = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchAPI<any[]>(`/rules${qs}`);
};

// Taxonomy
export const getTaxonomy = (format?: string) =>
  fetchAPI<any[]>(`/taxonomy${format ? `?format=${format}` : ""}`);

// Ecosystem
export const getEcosystemPlayers = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchAPI<any[]>(`/ecosystem${qs}`);
};
