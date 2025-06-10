import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import router from "./routes";
import "dotenv/config";

const PORT = Number(process.env.PORT) || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://127.0.0.1:5173";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}. See http://localhost:${PORT}`);
});
