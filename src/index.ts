import express, { Application, Request, Response } from "express";
import { config } from "dotenv";
import database from "./config/database";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from './routes/authRoutes'
import { errorHandler } from "./middleware/errorHandler";
config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use('/api/auth',authRouter)
app.use(errorHandler)

app.listen(port, async() => {
  console.log(`Server is listening on port ${port}`);
  database()
});
