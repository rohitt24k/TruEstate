import express from "express";
import { config } from "dotenv";
import { mainRoutes } from "./routes";
import AppError from "./utils/appError";
import {
  globalErrorHandler,
  zodErrorHandler,
} from "./middlewares/errorHandler";
import cors from "cors";
config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.set("query parser", "extended");

app.use("/api/v1", mainRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(zodErrorHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
