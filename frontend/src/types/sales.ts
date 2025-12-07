import type {
  CATEGORIES,
  GENDERS,
  PAYMENT_METHODS,
  REGIONS,
  SORT_BY,
  TAGS,
} from "@/utils/constants";

export type T_Region = (typeof REGIONS)[number];
export type T_Gender = (typeof GENDERS)[number];
export type T_Category = (typeof CATEGORIES)[number];
export type T_PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type T_Tags = (typeof TAGS)[number];

export type T_GetSalesDataFilters = {
  page?: number;
  limit?: number;
  search?: string;
  region?: T_Region[];
  gender?: T_Gender[];
  category?: T_Category[];
  paymentMethod?: T_PaymentMethod[];
  tag?: T_Tags[];
  minAge?: number;
  maxAge?: number;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: (typeof SORT_BY)[number];
  sortOrder?: "asc" | "desc";
};

export type T_Sales = {
  transactionId: number;
  date: string;
  gender: T_Gender;
  age: number;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  totalAmount?: number;
  quantity?: number;
  paymentMethod?: string;
  region?: T_Region;
  productId: string;
  productName?: string;
  category?: string;
  tags?: string;
};
