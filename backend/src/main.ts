import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./interfaces/http/routes/index";
import { pool } from "./infra/db/pg-client";

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(express.json());
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use("/", router);

async function startServer() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await pool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}

startServer();
