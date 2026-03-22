import dotenv from "dotenv";

dotenv.config();

import { validateServerEnv } from "./utils/validateEnv";

validateServerEnv();
