import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { Worker } from "worker_threads";
import http from "http";
import { setupSocket } from "./socket";
import router from "./routes";
import { serverErrorHandler } from "./controllers/error";
import serveReactApp from "./middleware/reactapp";

const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", `http://localhost:${PORT}`, `ws://localhost:${PORT}`],
    },
  }),
);
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);
app.use(serveReactApp);
app.use(express.static("build"));
app.use(serverErrorHandler);

const httpServer = http.createServer(app);

setupSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}. See http://localhost:${PORT}`);
});

const worker = new Worker("./src/utils/cronjobs.js");

worker.on("online", () => console.log("Worker is online and running cron jobs"));
worker.on("message", console.log);
worker.on("error", (error) => {
  console.error("Worker error: ", error);
  worker.terminate();
});
worker.on("exit", (code) => {
  if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
});
