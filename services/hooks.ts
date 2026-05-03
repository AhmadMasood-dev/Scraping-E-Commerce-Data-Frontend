import { useQuery } from "@tanstack/react-query";
import {
  fetchLandingData,
  fetchAllProducts,
  fetchCategoryProducts,
  fetchProductById,
  fetchZameenCategories,
  fetchZameenByCategory,
  fetchZameenSearch,
  fetchZameenCities,
  ZameenSearchParams,
} from "./api";

export function useLandingData() {
  return useQuery({
    queryKey: ["landing"],
    queryFn: fetchLandingData,
  });
}

export function useAllProducts(limit?: number) {
  return useQuery({
    queryKey: ["products", "all", limit],
    queryFn: () => fetchAllProducts(limit),
  });
}

export function useCategoryProducts(category: string, limit?: number) {
  return useQuery({
    queryKey: ["products", "category", category, limit],
    queryFn: () => fetchCategoryProducts(category, limit),
    enabled: !!category,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}

export function useSearchProducts(query: string, lang = 'en') {
  return useQuery({
    queryKey: ["search", query, lang],
    queryFn: () => import("./api").then(mod => mod.fetchSearchProducts(query, lang)),
    enabled: !!query,
  });
}

// ─── Zameen hooks ──────────────────────────────────────────────────────────────

export function useZameenCategories() {
  return useQuery({
    queryKey: ["zameen", "categories"],
    queryFn: fetchZameenCategories,
  });
}

export function useZameenByCategory(type: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["zameen", "category", type, page, limit],
    queryFn: () => fetchZameenByCategory(type, page, limit),
    enabled: !!type,
  });
}

export function useZameenSearch(params: ZameenSearchParams) {
  return useQuery({
    queryKey: ["zameen", "search", params],
    queryFn: () => fetchZameenSearch(params),
    enabled: !!(params.q || params.city || params.property_type || params.purpose),
  });
}

export function useZameenCities() {
  return useQuery({
    queryKey: ["zameen", "cities"],
    queryFn: fetchZameenCities,
  });
}
