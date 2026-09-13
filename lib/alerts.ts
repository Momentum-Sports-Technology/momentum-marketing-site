import fs from "fs";
import path from "path";

// Operational alerts the admin panel shows. The only one so far is a failed
// notification email: the submission itself is safe on disk, but nobody was
// told about it, so it has to be visible somewhere the organisers actually
// look. Email cannot carry this alert — email is what failed.

export type Alert = { at: string; kind: string; detail: string };

const dataDirectory = process.env.DATA_DIR || path.join(process.cwd(), "data");
const alertsFile = () => path.join(dataDirectory, "alerts.jsonl");

/** Never throws: an alert that fails to record must not fail the caller. */
export function recordAlert(kind: string, detail: string): void {
  try {
    fs.mkdirSync(dataDirectory, { recursive: true });
    const line = JSON.stringify({ at: new Date().toISOString(), kind, detail });
    fs.appendFileSync(alertsFile(), line + "\n", "utf8");
  } catch (error) {
    console.error("[alerts] could not record alert:", error);
  }
}

/** Newest first. Malformed lines are skipped rather than failing the read. */
export function readAlerts(): Alert[] {
  const file = alertsFile();
  if (!fs.existsSync(file)) return [];
  const alerts: Alert[] = [];
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      alerts.push(JSON.parse(line));
    } catch {
      // skip
    }
  }
  return alerts.reverse();
}

/** Dismisses everything. Alerts are a to-do list, not an audit trail. */
export function clearAlerts(): void {
  const file = alertsFile();
  if (fs.existsSync(file)) fs.rmSync(file);
}
