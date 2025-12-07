import { NextFunction, type Request, type Response } from "express";
import * as salesService from "../services/sales.service";
import { getSalesQuerySchema } from "../Validators/sales";

export async function GetSales(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validatedQuery = getSalesQuerySchema.parse(req.query);

    const data = await salesService.getSales(validatedQuery);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}
