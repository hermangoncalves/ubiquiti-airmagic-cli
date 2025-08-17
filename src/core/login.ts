import { logger } from "@/utils/logger";
import { Page } from "puppeteer-core";

type LoginParams = {
  page: Page;
  ip: string;
  username: string;
  password: string;
  timeouttMs: number;
};

export async function login({ page, ip, username, timeouttMs }: LoginParams) {
  await page.goto(`https://${ip}`, {
    waitUntil: "domcontentloaded",
    timeout: timeouttMs,
  });

  logger.info("Login bem-sucedido.");
}
