import { pgTable, text, integer, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const customers = pgTable(
  "customers",
  {
    customer_id: text("customer_id").primaryKey(),
    customer_name: text("customer_name").notNull(),
    phone: text("phone"),
    gender: text("gender"),
    age: integer("age"),
    region: text("region"),
    customer_type: text("customer_type"),
  },
  (table) => [
    index("customer_name_search_idx").using(
      "gin",
      sql`${table.customer_name} gin_trgm_ops`
    ),
    index("customer_phone_search_idx").using(
      "gin",
      sql`${table.phone} gin_trgm_ops`
    ),
    index("region_idx").on(table.region),
    index("gender_idx").on(table.gender),
    index("age_idx").on(table.age),
  ]
);
