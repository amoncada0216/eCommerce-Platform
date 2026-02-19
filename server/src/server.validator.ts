import dotenv from "dotenv";

import app from "@/app.validator.js";
import { env } from "@/config/env.config.js";

dotenv.config();

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
