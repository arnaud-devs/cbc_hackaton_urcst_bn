import express from "express";
import routes from "./routes/index";
import morgan from "morgan";
import config from "./config/config";
import errorHandler from "./middlewares/error-handler.middleware";
import cors from "cors";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Request logger
app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));

// App Routes
app.use(routes);

// Global error handler
app.use(errorHandler);

export default app;
