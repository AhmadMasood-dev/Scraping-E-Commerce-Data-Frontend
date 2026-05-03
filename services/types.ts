export interface PriceSource {
  store_name: string;
  native_id?: string;
  url: string;
  current_price: number;
}

export interface Product {
  _id: string;
  title: string;
  brand?: string;
  category: string;
  description?: string;
  image_url?: string;
  rating: number;
  specifications: Record<string, any>;
  price_sources: PriceSource[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
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
