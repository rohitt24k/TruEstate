import fs from "fs";
import csv from "csv-parser";
import { db } from "../src/db";
import { customers, products, sales } from "../src/db/schema";

const CSV_FILE_PATH = "./dataset.csv";
const BATCH_SIZE = 1000;

async function seed() {
  console.log("🚀 Starting Data Ingestion...");
  const start = Date.now();

  let salesBatch: any[] = [];
  let customersBatch: any[] = [];
  let productsBatch: any[] = [];

  const processBatch = async () => {
    if (salesBatch.length === 0) return;

    try {
      if (customersBatch.length > 0) {
        await db
          .insert(customers)
          .values(customersBatch)
          .onConflictDoNothing({ target: customers.customer_id });
      }

      if (productsBatch.length > 0) {
        await db
          .insert(products)
          .values(productsBatch)
          .onConflictDoNothing({ target: products.product_id });
      }

      if (salesBatch.length > 0) {
        await db
          .insert(sales)
          .values(salesBatch)
          .onConflictDoNothing({ target: sales.transaction_id });
      }

      console.log(`✅ Processed ${salesBatch.length} records...`);
    } catch (error) {
      console.error("❌ Batch Error:", error);
    } finally {
      salesBatch = [];
      customersBatch = [];
      productsBatch = [];
    }
  };

  const stream = fs.createReadStream(CSV_FILE_PATH).pipe(csv());

  for await (const row of stream) {
    // 1. Prepare Customer Object
    customersBatch.push({
      customer_id: row["Customer ID"],
      customer_name: row["Customer Name"],
      phone: row["Phone Number"],
      gender: row["Gender"],
      age: parseInt(row["Age"]) || 0,
      region: row["Customer Region"],
      customer_type: row["Customer Type"],
    });

    // 2. Prepare Product Object
    productsBatch.push({
      product_id: row["Product ID"],
      product_name: row["Product Name"],
      brand: row["Brand"],
      category: row["Product Category"],
      tags: row["Tags"],
    });

    // 3. Prepare Sale Object
    salesBatch.push({
      transaction_id: parseInt(row["Transaction ID"]),
      date: new Date(row["Date"]),
      customer_id: row["Customer ID"],
      product_id: row["Product ID"],
      quantity: parseInt(row["Quantity"]) || 0,
      price_per_unit: parseFloat(row["Price per Unit"]) || 0,
      discount_percentage: parseFloat(row["Discount Percentage"]) || 0,
      total_amount: parseFloat(row["Total Amount"]) || 0,
      final_amount: parseFloat(row["Final Amount"]) || 0,
      payment_method: row["Payment Method"],
      order_status: row["Order Status"],
      delivery_type: row["Delivery Type"],
      store_id: row["Store ID"],
      store_location: row["Store Location"],
      salesperson_id: row["Salesperson ID"],
      employee_name: row["Employee Name"],
    });

    if (salesBatch.length >= BATCH_SIZE) {
      await processBatch();
    }
  }

  await processBatch();

  const end = Date.now();
  console.log(`Data Ingestion Complete in ${(end - start) / 1000}s`);
  process.exit(0);
}

seed();
