import {
  pgTable,
  text,
  integer,
  index,
  timestamp,
  real,
} from "drizzle-orm/pg-core";
import { customers } from "./customer";
import { products } from "./product";

export const sales = pgTable(
  "sales",
  {
    transaction_id: integer("transaction_id").primaryKey(),
    date: timestamp("date").notNull(),
    customer_id: text("customer_id").references(() => customers.customer_id),
    product_id: text("product_id").references(() => products.product_id),
    quantity: integer("quantity"),
    price_per_unit: real("price_per_unit"),
    discount_percentage: real("discount_percentage"),
    total_amount: real("total_amount"),
    final_amount: real("final_amount"),
    payment_method: text("payment_method"),
    order_status: text("order_status"),
    delivery_type: text("delivery_type"),
    store_id: text("store_id"),
    store_location: text("store_location"),
    salesperson_id: text("salesperson_id"),
    employee_name: text("employee_name"),
  },
  (table) => [
    index("date_idx").on(table.date),
    index("amount_idx").on(table.final_amount),
    index("quantity_idx").on(table.quantity),
    index("payment_method_idx").on(table.payment_method),
    index("fk_customer_idx").on(table.customer_id),
    index("fk_product_idx").on(table.product_id),
  ]
);
