import app from "./app";
import config from "./config/config";
import { connectDatabase } from "./database/client";
import cors from "cors";

app.use(cors());

connectDatabase().then(() => {
  app.listen(config.port, () => {
    console.log(`Server is running on PORT:${config.port}`);
  });
});
