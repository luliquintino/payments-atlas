"use client";

import { useState, useMemo } from "react";
import { searchAll, type SearchResult, type SearchResultType } from "@/lib/search-index";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<SearchResultType | null>(null);

  const results: SearchResult[] = useMemo(() => {
    if (!query && !typeFilter) return [];
    return searchAll(query, typeFilter);
  }, [query, typeFilter]);

  const clearSearch = () => {
    setQuery("");
    setTypeFilter(null);
  };

  return {
    query,
    setQuery,
    typeFilter,
    setTypeFilter,
    results,
    clearSearch,
    hasResults: query.length > 0 || !!typeFilter,
  };
}
