import fs from "fs";
import yaml from "js-yaml";
import { Config } from "@/types";
import path from "path";

export function loadConfig(): Config {
  const configPath = path.join(process.env.HOME || "", ".airmagic.yaml");

  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at ${configPath}`);
  }

  const configFile = fs.readFileSync(configPath, "utf8");
  return yaml.load(configFile) as Config;
}