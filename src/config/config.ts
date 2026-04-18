import dotenv from "dotenv";

dotenv.config();

const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  apiUrl: process.env.API_URL,
  clientUrl: process.env.CLIENT_URL,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
};

export default config;
