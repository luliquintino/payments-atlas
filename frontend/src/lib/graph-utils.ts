/**
 * Utilitários de grafo — Payments Knowledge System
 *
 * Funções para busca de caminho mais curto (BFS), dependências transitivas
 * e dependentes transitivos usadas pelo grafo de dependências.
 */

import type { GraphEdge } from "@/data/types";

// ---------------------------------------------------------------------------
// BFS — Caminho mais curto entre dois nós
// ---------------------------------------------------------------------------

/**
 * Encontra o caminho mais curto entre `fromId` e `toId` usando BFS.
 * Trata o grafo como direcionado (from → to).
 * Retorna um array de IDs de nó representando o caminho, ou vazio se não houver caminho.
 */
export function findShortestPath(
  edges: GraphEdge[],
  fromId: string,
  toId: string,
): string[] {
  if (fromId === toId) return [fromId];

  // Construir lista de adjacência (bidirecional para encontrar caminhos em ambas direções)
  const adjacency = new Map<string, string[]>();

  for (const edge of edges) {
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, []);
    if (!adjacency.has(edge.to)) adjacency.set(edge.to, []);
    adjacency.get(edge.from)!.push(edge.to);
    adjacency.get(edge.to)!.push(edge.from);
  }

  // BFS
  const visited = new Set<string>([fromId]);
  const queue: string[][] = [[fromId]];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];

    const neighbors = adjacency.get(current) ?? [];
    for (const neighbor of neighbors) {
      if (neighbor === toId) {
        return [...path, neighbor];
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return [];
}

// ---------------------------------------------------------------------------
// Dependências transitivas (recursivas)
// ---------------------------------------------------------------------------

/**
 * Retorna todas as dependências transitivas de um nó (ou seja, todos os nós
 * que `nodeId` depende, direta ou indiretamente).
 * Segue arestas na direção from → to (nodeId é o "from").
 */
export function getTransitiveDeps(
  edges: GraphEdge[],
  nodeId: string,
): Set<string> {
  const result = new Set<string>();
  const stack = [nodeId];

  // Construir mapa de dependências: from → [to]
  const depsMap = new Map<string, string[]>();
  for (const edge of edges) {
    if (!depsMap.has(edge.from)) depsMap.set(edge.from, []);
    depsMap.get(edge.from)!.push(edge.to);
  }

  while (stack.length > 0) {
    const current = stack.pop()!;
    const deps = depsMap.get(current) ?? [];
    for (const dep of deps) {
      if (!result.has(dep)) {
        result.add(dep);
        stack.push(dep);
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Dependentes transitivos (recursivos)
// ---------------------------------------------------------------------------

/**
 * Retorna todos os dependentes transitivos de um nó (ou seja, todos os nós
 * que dependem de `nodeId`, direta ou indiretamente).
 * Segue arestas na direção inversa: to → from (nodeId é o "to").
 */
export function getTransitiveDependents(
  edges: GraphEdge[],
  nodeId: string,
): Set<string> {
  const result = new Set<string>();
  const stack = [nodeId];

  // Construir mapa inverso: to → [from]
  const dependentsMap = new Map<string, string[]>();
  for (const edge of edges) {
    if (!dependentsMap.has(edge.to)) dependentsMap.set(edge.to, []);
    dependentsMap.get(edge.to)!.push(edge.from);
  }

  while (stack.length > 0) {
    const current = stack.pop()!;
    const depnts = dependentsMap.get(current) ?? [];
    for (const dep of depnts) {
      if (!result.has(dep)) {
        result.add(dep);
        stack.push(dep);
      }
    }
  }

  return result;
}
