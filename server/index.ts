import "dotenv/config";
import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import { adminRoutes } from "./routes/admin.js";
import { bookingRoutes } from "./routes/bookings.js";
import { ensureDatabaseSchema } from "./db.js";
import { seedAdminUser } from "./seed.js";

const FRONTEND_ORIGIN = "https://deviousdevv303.github.io";
const PORT = Number(process.env.PORT || 10000);
const LOCAL_FRONTEND_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:4174",
  "http://127.0.0.1:4174",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cors({
  origin(origin, callback) {
    const allowedOrigins = new Set([
      FRONTEND_ORIGIN,
      ...LOCAL_FRONTEND_ORIGINS,
    ]);

    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS origin not allowed"));
  },
}));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "marlenes-cleaning-services-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  const message = error instanceof Error ? error.message : "Unknown server error";
  console.error("[api] Unhandled error:", message);
  res.status(500).json({ error: "Internal server error" });
};

app.use(errorHandler);

async function start(): Promise<void> {
  await ensureDatabaseSchema();
  await seedAdminUser();

  app.listen(PORT, () => {
    console.info(`[api] Marlene's Cleaning Services backend listening on ${PORT}`);
  });
}

start().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown startup error";
  console.error("[api] Startup failed:", message);
  process.exit(1);
});
