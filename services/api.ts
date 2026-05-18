import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import {
  Product,
  ZameenProperty,
  PakWheelsVehicle,
  ScraperMeta,
  SentimentData,
  AuthUser,
} from "./types";
import { getAuthToken } from "@/lib/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080/api/v1",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (e) =>
    axiosRetry.isNetworkOrIdempotentRequestError(e) ||
    (e.response?.status !== undefined && e.response.status >= 500),
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Surface backend's structured error.code to the UI through Error.message
api.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ error?: { code?: string; message?: string } }>) => {
    const data = err.response?.data;
    const message = data?.error?.message || err.message || "Request failed";
    return Promise.reject(Object.assign(new Error(message), { code: data?.error?.code, status: err.response?.status }));
  }
);

// ─── Products ────────────────────────────────────────────────────────────────
export async function fetchLandingData(): Promise<Record<string, Product[]>> {
  const { data } = await api.get("/products/landing");
  return data.data;
}

export async function fetchAllProducts(limit = 40, page = 1): Promise<Product[]> {
  const { data } = await api.get("/products", { params: { limit, page } });
  return data.data;
}

export async function fetchCategoryProducts(category: string, limit = 40): Promise<Product[]> {
  const { data } = await api.get(`/products/category/${encodeURIComponent(category)}`, { params: { limit } });
  return data.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
}

export interface StoreResult {
  _id: string;
  store_name: string;
  native_id?: string;
  title: string;
  description?: string;
  rating: number;
  price: number;
  reviews?: number;
  url: string;
  brand?: string;
  category?: string;
  image_url?: string;
}

export interface ComparisonEntry {
  store_name: string;
  price: number;
  url: string;
  rating?: number;
  reviews?: number;
  product_id?: string;
  title: string;
  image_url?: string | null;
}

export interface PrimaryProduct {
  title: string;
  description?: string;
  image_url?: string | null;
  rating?: number;
  category?: string;
  brand?: string;
  cheapest_store?: string;
  comparisons: ComparisonEntry[];
  has_comparison: boolean;
}

export interface SearchResponse {
  data: Product[];
  primary: PrimaryProduct | null;
  storeResults: StoreResult[];
  meta: ScraperMeta | null;
  isScraping: boolean;
  wasScraped: boolean;
  message?: string;
}

export async function fetchSearchProducts(query: string, lang = "en"): Promise<SearchResponse> {
  const response = await api.get("/products/search", {
    params: { q: query, lang },
    validateStatus: (s) => s === 200 || s === 202,
  });
  const json = response.data;
  return {
    data: json.data ?? [],
    primary: json.primary ?? null,
    storeResults: json.store_results ?? [],
    meta: json.meta ?? null,
    isScraping: response.status === 202,
    wasScraped: json.scraped === true,
    message: json.message,
  };
}

export async function fetchProductSentiment(id: string): Promise<SentimentData> {
  const { data } = await api.get(`/products/${id}/reviews/sentiment`);
  return data.data;
}

export async function toggleProductAlert(id: string): Promise<{ wishlist: string[] }> {
  const { data } = await api.post(`/products/${id}/alerts`);
  return { wishlist: data.wishlist };
}

// ─── Zameen ─────────────────────────────────────────────────────────────────
export async function fetchZameenCategories(): Promise<Record<string, ZameenProperty[]>> {
  const { data } = await api.get("/zameen/categories");
  return data.data;
}

export async function fetchZameenByCategory(type: string, page = 1, limit = 20) {
  const { data } = await api.get(`/zameen/category/${encodeURIComponent(type)}`, { params: { page, limit } });
  return { data: data.data as ZameenProperty[], pagination: data.pagination };
}

export interface ZameenSearchParams {
  q?: string;
  city?: string;
  property_type?: string;
  purpose?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  baths?: number;
  page?: number;
  limit?: number;
}

export async function fetchZameenSearch(params: ZameenSearchParams) {
  const { data } = await api.get("/zameen/search", { params });
  return { data: data.data as ZameenProperty[], pagination: data.pagination };
}

export async function fetchZameenCities(): Promise<string[]> {
  const { data } = await api.get("/zameen/cities");
  return data.data;
}

// ─── PakWheels ──────────────────────────────────────────────────────────────
export async function fetchPakWheelsCategories(): Promise<Record<string, PakWheelsVehicle[]>> {
  const { data } = await api.get("/pakwheels/categories");
  return data.data;
}

export async function fetchPakWheelsMakes(): Promise<string[]> {
  const { data } = await api.get("/pakwheels/makes");
  return data.data;
}

export async function fetchPakWheelsBodyTypes(): Promise<string[]> {
  const { data } = await api.get("/pakwheels/body-types");
  return data.data;
}

export async function fetchPakWheelsCities(): Promise<string[]> {
  const { data } = await api.get("/pakwheels/cities");
  return data.data;
}

export interface PakWheelsSearchParams {
  q?: string;
  make?: string;
  model?: string;
  city?: string;
  fuel_type?: string;
  transmission?: string;
  condition?: "New" | "Used";
  body_type?: string;
  province?: string;
  assembly?: string;
  min_year?: number;
  max_year?: number;
  min_price?: number;
  max_price?: number;
  sort?: "price_asc" | "price_desc" | "year_desc" | "newest";
  page?: number;
  limit?: number;
}

export async function fetchPakWheelsSearch(params: PakWheelsSearchParams) {
  const { data } = await api.get("/pakwheels/search", { params });
  return { data: data.data as PakWheelsVehicle[], pagination: data.pagination };
}

export async function fetchPakWheelsById(id: string): Promise<PakWheelsVehicle> {
  const { data } = await api.get(`/pakwheels/${id}`);
  return data.data;
}

// ─── Auth ───────────────────────────────────────────────────────────────────
export async function registerUser(email: string, password: string): Promise<AuthUser> {
  const { data } = await api.post("/auth/register", { email, password });
  return data.data;
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const { data } = await api.post("/auth/login", { email, password });
  return data.data;
}

export default api;
