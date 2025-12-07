import z from "zod";

const allowedRegions = ["South", "West", "North", "East", "Central"] as const;
const allowedGenders = ["Male", "Female"] as const;
const allowedCategories = ["Beauty", "Clothing", "Electronics"] as const;
const allowedPaymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "UPI",
  "Wallet",
] as const;
const allowedTags = [
  "accessories",
  "beauty",
  "casual",
  "cotton",
  "fashion",
  "formal",
  "fragrance-free",
  "gadgets",
  "makeup",
  "organic",
  "portable",
  "skincare",
  "smart",
  "unisex",
  "wireless",
] as const;

export const getSalesQuerySchema = z.object({
  page: z.preprocess(
    (val) =>
      val === undefined || val === null || val === "" ? undefined : Number(val),
    z.number().int().positive().optional().default(1)
  ),
  limit: z.preprocess(
    (val) =>
      val === undefined || val === null || val === "" ? undefined : Number(val),
    z.number().int().positive().optional().default(10)
  ),
  search: z.string().optional().default(""),
  region: z.array(z.enum(allowedRegions)).optional(),
  gender: z.array(z.enum(allowedGenders)).optional(),
  category: z.array(z.enum(allowedCategories)).optional(),
  paymentMethod: z.array(z.enum(allowedPaymentMethods)).optional(),
  tags: z.array(z.enum(allowedTags)).optional(),
  minAge: z.preprocess(
    (val) =>
      val === undefined || val === null || val === "" ? undefined : Number(val),
    z.number().int().positive().optional()
  ),
  maxAge: z.preprocess(
    (val) =>
      val === undefined || val === null || val === "" ? undefined : Number(val),
    z.number().int().positive().optional()
  ),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minPrice: z.preprocess(
    (val) =>
      val === undefined || val === null || val === "" ? undefined : Number(val),
    z.number().positive().optional()
  ),
  maxPrice: z.preprocess(
    (val) =>
      val === undefined || val === null || val === "" ? undefined : Number(val),
    z.number().positive().optional()
  ),
  sortBy: z.enum(["date", "quantity", "amount", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
