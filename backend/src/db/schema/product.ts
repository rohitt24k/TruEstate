import { pgTable, text, integer, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const products = pgTable(
  "products",
  {
    product_id: text("product_id").primaryKey(),
    product_name: text("product_name"),
    brand: text("brand"),
    category: text("category"),
    tags: text("tags"),
  },
  (table) => [
    index("category_idx").on(table.category),
    index("tags_idx").using("gin", sql`${table.tags} gin_trgm_ops`),
  ]
);
