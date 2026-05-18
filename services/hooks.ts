import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchLandingData,
  fetchAllProducts,
  fetchCategoryProducts,
  fetchProductById,
  fetchSearchProducts,
  fetchProductSentiment,
  toggleProductAlert,
  fetchZameenCategories,
  fetchZameenByCategory,
  fetchZameenSearch,
  fetchZameenCities,
  ZameenSearchParams,
  fetchPakWheelsCategories,
  fetchPakWheelsMakes,
  fetchPakWheelsBodyTypes,
  fetchPakWheelsCities,
  fetchPakWheelsSearch,
  fetchPakWheelsById,
  PakWheelsSearchParams,
  registerUser,
  loginUser,
} from "./api";
import { setAuthUser } from "@/lib/auth";

// ─── Products ────────────────────────────────────────────────────────────────
export function useLandingData() {
  return useQuery({
    queryKey: ["landing"],
    queryFn: fetchLandingData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllProducts(limit?: number) {
  return useQuery({
    queryKey: ["products", "all", limit],
    queryFn: () => fetchAllProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryProducts(category: string, limit?: number) {
  return useQuery({
    queryKey: ["products", "category", category, limit],
    queryFn: () => fetchCategoryProducts(category, limit),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}

export function useSearchProducts(query: string, lang = "en") {
  return useQuery({
    queryKey: ["search", query, lang],
    queryFn: () => fetchSearchProducts(query, lang),
    enabled: !!query,
    staleTime: 0,
  });
}

export function useProductSentiment(id: string) {
  return useQuery({
    queryKey: ["sentiment", id],
    queryFn: () => fetchProductSentiment(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => toggleProductAlert(productId),
    onMutate: async (productId) => {
      await qc.cancelQueries({ queryKey: ["product", productId] });
      const previous = qc.getQueryData(["product", productId]);
      // Optimistic flag — UI flips immediately
      qc.setQueryData(["product", productId], (old: unknown) =>
        old ? { ...(old as Record<string, unknown>), _wishlistOptimistic: true } : old
      );
      return { previous, productId };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(["product", ctx.productId], ctx.previous);
    },
    onSettled: (_data, _err, productId) => {
      qc.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}

// ─── Zameen ─────────────────────────────────────────────────────────────────
export function useZameenCategories() {
  return useQuery({ queryKey: ["zameen", "categories"], queryFn: fetchZameenCategories });
}

export function useZameenByCategory(type: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["zameen", "category", type, page, limit],
    queryFn: () => fetchZameenByCategory(type, page, limit),
    enabled: !!type,
    staleTime: 10 * 60 * 1000,
  });
}

export function useZameenSearch(params: ZameenSearchParams) {
  return useQuery({
    queryKey: ["zameen", "search", params],
    queryFn: () => fetchZameenSearch(params),
    enabled: !!(params.q || params.city || params.property_type || params.purpose ||
                params.min_price || params.max_price || params.bedrooms || params.baths),
    staleTime: 10 * 60 * 1000,
  });
}

export function useZameenCities() {
  return useQuery({ queryKey: ["zameen", "cities"], queryFn: fetchZameenCities });
}

// ─── PakWheels ──────────────────────────────────────────────────────────────
export function usePakWheelsCategories() {
  return useQuery({ queryKey: ["pakwheels", "categories"], queryFn: fetchPakWheelsCategories });
}

export function usePakWheelsMakes() {
  return useQuery({ queryKey: ["pakwheels", "makes"], queryFn: fetchPakWheelsMakes });
}

export function usePakWheelsBodyTypes() {
  return useQuery({ queryKey: ["pakwheels", "body-types"], queryFn: fetchPakWheelsBodyTypes });
}

export function usePakWheelsCities() {
  return useQuery({ queryKey: ["pakwheels", "cities"], queryFn: fetchPakWheelsCities });
}

export function usePakWheelsSearch(params: PakWheelsSearchParams) {
  return useQuery({
    queryKey: ["pakwheels", "search", params],
    queryFn: () => fetchPakWheelsSearch(params),
    enabled: Object.values(params).some((v) => v !== undefined && v !== "" && v !== null),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePakWheelsVehicle(id: string) {
  return useQuery({
    queryKey: ["pakwheels", "vehicle", id],
    queryFn: () => fetchPakWheelsById(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}

// ─── Auth ───────────────────────────────────────────────────────────────────
export function useRegister() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => registerUser(email, password),
    onSuccess: (user) => setAuthUser(user),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginUser(email, password),
    onSuccess: (user) => setAuthUser(user),
  });
}
