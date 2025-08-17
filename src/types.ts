export type Mode = "manual" | "auto";

export interface AppConfig {
  name: string;
  default_env: string;
  headless: boolean;
}

export interface Device {
  name: string;
  ip: string;
  username: string;
}

export interface NetworkConfig {
  timeout: number;
}

export interface Config {
  app: AppConfig;
  network: NetworkConfig;
  devices: Device[];
}
