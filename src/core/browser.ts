import { logger } from "@/utils/logger";
import path from "path";
import fs from "fs";
import puppeteer, { Browser, Page } from "puppeteer-core";

export async function launchBrowser(headless: boolean): Promise<Browser> {
  const browser = await puppeteer.launch({
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
    headless: headless,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--ignore-certificate-errors",
    ],
  });

  return browser;
}

export async function newPage(browser: Browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari"
  );
  page.on("pageerror", (err) =>
    logger.warn("Page error", { err: String(err) })
  );
  page.on("console", (msg) => {
    if (msg.type() === "error")
      logger.warn("Console error on page", { text: msg.text() });
  });
  return page;
}

export async function screenshot(page: Page, name: string) {
  const dir = path.resolve("logs", "screens");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, `${Date.now()}-${name}.png`);
  await page.screenshot({ path: p as `${string}.png` });
  logger.info(`Screenshot salvo: ${p}`);
}
