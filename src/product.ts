// Type definitions for the response of the Product List API

type ProductSize = {
  _id: string;
  name: string;
  size_id: string;
  date: string;
  price: number;
};

type ProductColor = {
  _id: string;
  name: string;
  color_id: string;
  date: string;
  sizes: ProductSize[];
};

type ProductImage = {
  _id: string;
  url: string;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  sku: string;
  sku_id: string;
  price: number;
  images: ProductImage[];
  category: string;
  subCategory: string;
  colors: ProductColor[];
  brand_name: string;
  style_id: string;
  popular: boolean;
  date: number; // Unix timestamp
  __v: number;
};

type ProductListResponse = {
  success: boolean;
  count: number;
  products: Product[];
};
