import { z } from "zod";

import { loginSchema } from "../../../lib/validation";

export type LoginValues = z.infer<typeof loginSchema>;

export type ServerHealthState = "online" | "offline" | "checking";
