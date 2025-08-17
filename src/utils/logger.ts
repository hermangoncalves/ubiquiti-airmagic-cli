import fs from "node:fs";
import path from "node:path";

const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

function ts() {
  return new Date().toISOString();
}

export const logger = {
  info: (msg: string, meta: any = {}) => {
    const line = `[${ts()}] INFO  ${msg} ${safeMeta(meta)}\n`;
    fs.appendFileSync(path.join(logDir, "airmagic.log"), line);
    console.log(line.trim());
  },
  warn: (msg: string, meta: any = {}) => {
    const line = `[${ts()}] WARN  ${msg} ${safeMeta(meta)}\n`;
    fs.appendFileSync(path.join(logDir, "airmagic.log"), line);
    console.warn(line.trim());
  },
  error: (msg: string, meta: any = {}) => {
    const redacted = redact(meta);
    const line = `[${ts()}] ERROR ${msg} ${safeMeta(redacted)}\n`;
    fs.appendFileSync(path.join(logDir, "airmagic.log"), line);
    console.error(line.trim());
  },
};

function safeMeta(meta: any) {
  try {
    return JSON.stringify(redact(meta));
  } catch {
    return "";
  }
}

function redact(obj: any) {
  if (!obj) return obj;
  const s = JSON.parse(JSON.stringify(obj));
  if (s.password) s.password = "***";
  if (s.credentials) s.credentials = "***";
  return s;
}
