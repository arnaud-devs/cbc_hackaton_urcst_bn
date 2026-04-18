import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import routes from "./routes/index";
import config from "./config/config";
import errorHandler from "./middlewares/error-handler.middleware";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));

// ─── Swagger docs (/api/docs) ─────────────────────────────────────────────────
const swaggerPath = path.join(__dirname, "../src/docs/swagger.yaml");
const swaggerDoc = yaml.load(
  fs.readFileSync(
    fs.existsSync(swaggerPath) ? swaggerPath : path.join(__dirname, "docs/swagger.yaml"),
    "utf8"
  )
) as object;

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ─── API routes ───────────────────────────────────────────────────────────────
app.use(routes);

app.use(errorHandler);

export default app;
