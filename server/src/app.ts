import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import router from "./routes";
import { Worker } from "worker_threads";
import "dotenv/config";

const PORT = Number(process.env.PORT) || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: CLIENT_URL,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);

const worker = new Worker("./src/utils/cronjobs.js");

worker.on("online", () => console.log("Worker is online and running cron jobs"));
worker.on("message", console.log);
worker.on("error", (error) => {
  console.error("Worker error: ", error);
  worker.terminate();
});
worker.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Worker stopped with exit code ${code}`);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}. See http://localhost:${PORT}`);
});
