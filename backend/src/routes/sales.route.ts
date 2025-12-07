import express from "express";
import { GetSales } from "../controllers/sales.controller";

const salesRoutes = express.Router();

salesRoutes.get("/", GetSales);

export { salesRoutes };
