export interface HistoricalPrice {
  price: number;
  date: string;
}

export interface PriceSource {
  store_name: string;
  native_id?: string;
  url: string;
  current_price: number;
  historical_prices?: HistoricalPrice[];
}

export interface Product {
  _id: string;
  title: string;
  brand?: string;
  category: string;
  description?: string;
  image_url?: string;
  rating: number;
  reviews?: number;
  availability?: string;
  specifications: Record<string, unknown>;
  price_sources: PriceSource[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination?: { total: number; page: number; pages: number; limit?: number };
}

export interface ZameenProperty {
  _id: string;
  property_id?: number;
  location_id?: number;
  page_url?: string;
  property_type?: string;
  price?: number;
  location?: string;
  city?: string;
  province_name?: string;
  latitude?: number;
  longitude?: number;
  baths?: number;
  area?: string;
  purpose?: string;
  bedrooms?: number;
  date_added?: string;
  agency?: string;
  agent?: string;
  area_type?: string;
  area_size?: number;
  area_category?: string;
}

export interface PakWheelsVehicle {
  _id: string;
  title: string;
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  city?: string;
  price?: number;
  condition?: 'New' | 'Used';
  description?: string;
  image_urls?: string[];
  seller_type?: 'Individual' | 'Dealer';
  posted_at?: string;
  source_url?: string;
}

export interface ScraperMeta {
  totalStores: number;
  successfulStores: { name: string; count: number; durationMs: number }[];
  failedStores: { name: string; reason: string }[];
  durationMs: number;
  fromCache: boolean;
  itemsScraped?: number;
  itemsPersisted?: number;
  nlp?: {
    language: string;
    translated: string;
    keywords: string[];
    units: { value: number; unit: string }[];
  };
}

export interface SentimentData {
  quality_score: number;
  distribution: { positive: number; neutral: number; negative: number };
  total_reviews: number;
  reviews: {
    _id: string;
    text?: string;
    sentiment_label?: string;
    sentiment_score?: number;
    rating?: number;
    author?: string;
    createdAt?: string;
  }[];
}

export interface AuthUser {
  _id: string;
  email: string;
  token: string;
}
