import { loadConfig } from "./utils/config";
import inquirer from "inquirer";
import { launchBrowser, newPage, screenshot } from "./core/browser";
import { login } from "./core/login";

async function main() {
  const cfg = loadConfig();
  const devices = cfg.devices;

  const { deviceIndex } = await inquirer.prompt<{ deviceIndex: number }>([
    {
      type: "list",
      name: "deviceIndex",
      message: "Select an ubiquiti device",
      choices: devices.map((d, i) => ({
        name: `${d.name} (${d.ip})`,
        value: i,
      })),
    },
  ]);

  const selectedDevice = devices[deviceIndex];

  const { password } = await inquirer.prompt<{ password: string }>([
    {
      type: "password",
      name: "password",
      message: `Password for ${selectedDevice.username}@${selectedDevice.ip}:`,
      mask: "*",
    },
  ]);

  const browser = await launchBrowser(cfg.app.headless);
  const page = await newPage(browser);
  await login({
    page,
    ip: selectedDevice.ip,
    username: selectedDevice.username,
    password,
    timeouttMs: cfg.network.timeout,
  });

  await screenshot(page, "error");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
