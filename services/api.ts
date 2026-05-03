import axios from "axios";
import { Product, ZameenProperty } from "./types";

// Axios instance — base URL & sensible timeouts configured once
const api = axios.create({
  baseURL: "http://127.0.0.1:8080/api/v1",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

// ─── Products ─────────────────────────────────────────────────────────────────

export async function fetchLandingData(): Promise<Record<string, Product[]>> {
  const { data } = await api.get("/products/landing");
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchAllProducts(limit = 40): Promise<Product[]> {
  const { data } = await api.get("/products", { params: { limit } });
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchCategoryProducts(category: string, limit = 40): Promise<Product[]> {
  const { data } = await api.get(`/products/category/${category}`, { params: { limit } });
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const { data } = await api.get(`/products/${id}`);
  if (!data.success) throw new Error(data.message);
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

export async function fetchSearchProducts(
  query: string,
  lang = "en"
): Promise<{ data: Product[]; storeResults: StoreResult[]; isScraping: boolean; wasScraped: boolean; message?: string }> {
  const response = await api.get("/products/search", {
    params: { q: query, lang },
    validateStatus: (status) => status === 200 || status === 202,
  });
  const json = response.data;
  if (!json.success) throw new Error(json.message);
  return {
    data: json.data ?? [],
    storeResults: json.store_results ?? [],
    isScraping: response.status === 202,
    wasScraped: json.scraped === true,
    message: json.message,
  };
}

// ─── Zameen.pk API ─────────────────────────────────────────────────────────────

export async function fetchZameenCategories(): Promise<Record<string, ZameenProperty[]>> {
  const { data } = await api.get("/zameen/categories");
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchZameenByCategory(
  type: string,
  page = 1,
  limit = 20
): Promise<{ data: ZameenProperty[]; pagination: { total: number; page: number; pages: number; limit: number } }> {
  const { data } = await api.get(`/zameen/category/${encodeURIComponent(type)}`, {
    params: { page, limit },
  });
  if (!data.success) throw new Error(data.message);
  return { data: data.data, pagination: data.pagination };
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

export async function fetchZameenSearch(
  params: ZameenSearchParams
): Promise<{ data: ZameenProperty[]; pagination: { total: number; page: number; pages: number; limit: number } }> {
  const { data } = await api.get("/zameen/search", { params });
  if (!data.success) throw new Error(data.message);
  return { data: data.data, pagination: data.pagination };
}

export async function fetchZameenCities(): Promise<string[]> {
  const { data } = await api.get("/zameen/cities");
  if (!data.success) throw new Error(data.message);
  return data.data;
}
