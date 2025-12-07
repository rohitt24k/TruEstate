import { db } from "../db";
import { sales, customers, products } from "../db/schema";
import {
  eq,
  and,
  or,
  ilike,
  gte,
  lte,
  inArray,
  desc,
  asc,
  count,
  sum,
} from "drizzle-orm";

export interface SalesFilters {
  page?: number;
  limit?: number;
  search?: string; // Name or Phone
  region?: string[]; // Multi-select
  gender?: string[];
  category?: string[];
  paymentMethod?: string[];
  tags?: string[]; // Filter by tag presence
  minAge?: number;
  maxAge?: number;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "date" | "quantity" | "amount" | "name";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const getSales = async (filters: SalesFilters) => {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        ilike(customers.customer_name, `%${filters.search}%`),
        ilike(customers.phone, `%${filters.search}%`)
      )
    );
  }

  if (filters.region?.length) {
    conditions.push(inArray(customers.region, filters.region));
  }
  if (filters.gender?.length) {
    conditions.push(inArray(customers.gender, filters.gender));
  }
  if (filters.category?.length) {
    conditions.push(inArray(products.category, filters.category));
  }
  if (filters.paymentMethod?.length) {
    conditions.push(inArray(sales.payment_method, filters.paymentMethod));
  }

  if (filters.minAge) conditions.push(gte(customers.age, filters.minAge));
  if (filters.maxAge) conditions.push(lte(customers.age, filters.maxAge));

  if (filters.startDate)
    conditions.push(gte(sales.date, new Date(filters.startDate)));
  if (filters.endDate)
    conditions.push(lte(sales.date, new Date(filters.endDate)));

  if (filters.minPrice)
    conditions.push(gte(sales.final_amount, filters.minPrice));
  if (filters.maxPrice)
    conditions.push(lte(sales.final_amount, filters.maxPrice));

  if (filters.tags?.length) {
    const tagConditions = filters.tags.map((tag) =>
      ilike(products.tags, `%${tag}%`)
    );
    conditions.push(or(...tagConditions));
  }

  let orderByClause = desc(sales.date);

  if (filters.sortBy) {
    const direction = filters.sortOrder === "asc" ? asc : desc;

    switch (filters.sortBy) {
      case "quantity":
        orderByClause = direction(sales.quantity);
        break;
      case "amount":
        orderByClause = direction(sales.final_amount);
        break;
      case "name":
        orderByClause = direction(customers.customer_name);
        break;
      case "date":
      default:
        orderByClause = direction(sales.date);
    }
  }

  const dataQuery = db
    .select({
      transactionId: sales.transaction_id,
      date: sales.date,
      gender: customers.gender,
      age: customers.age,
      customerId: customers.customer_id,
      customerName: customers.customer_name,
      customerPhone: customers.phone,
      totalAmount: sales.final_amount,
      quantity: sales.quantity,
      paymentMethod: sales.payment_method,
      region: customers.region,
      productId: products.product_id,
      productName: products.product_name,
      category: products.category,
      tags: products.tags,
    })
    .from(sales)
    .innerJoin(customers, eq(sales.customer_id, customers.customer_id))
    .innerJoin(products, eq(sales.product_id, products.product_id))
    .where(and(...conditions))
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  const countQuery = db
    .select({
      count: count(),
      totalUnitsSold: sum(sales.quantity),
      totalFinalAmount: sum(sales.final_amount),
      totalSalesAmount: sum(sales.total_amount),
    })
    .from(sales)
    .innerJoin(customers, eq(sales.customer_id, customers.customer_id))
    .innerJoin(products, eq(sales.product_id, products.product_id))
    .where(and(...conditions));

  const [paginatedData, totalResult] = await Promise.all([
    dataQuery,
    countQuery,
  ]);

  const totalItems = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: {
      paginatedData,
      kpiData: {
        totalUnitsSold: Math.max(0, Number(totalResult[0]?.totalUnitsSold)),
        totalAmount: Math.max(0, Number(totalResult[0]?.totalFinalAmount)),
        totalDiscount: Math.max(
          0,
          (Number(totalResult[0]?.totalSalesAmount) ?? 0) -
            (Number(totalResult[0]?.totalFinalAmount) ?? 0)
        ),
      },
    },
    pagination: {
      page,
      limit,
      total: totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
