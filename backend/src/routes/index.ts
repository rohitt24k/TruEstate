import express from "express";
import { salesRoutes } from "./sales.route";

const mainRoutes = express.Router();

mainRoutes.get("/ping", (req, res) => {
  res.send("pong");
});

mainRoutes.use("/sales", salesRoutes);

export { mainRoutes };
