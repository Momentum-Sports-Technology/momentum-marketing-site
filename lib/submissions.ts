import fs from "fs";
import path from "path";

// Append-only JSONL log of form submissions on the data volume. This is the
// backup for when email fails, and the newsletter list until a mailing tool
// is wired in.

const dataDirectory = process.env.DATA_DIR || path.join(process.cwd(), "data");

export function appendSubmission(
  kind: "contact" | "register" | "newsletter",
  record: object
): void {
  fs.mkdirSync(dataDirectory, { recursive: true });
  const line = JSON.stringify({ kind, receivedAt: new Date().toISOString(), ...record });
  fs.appendFileSync(path.join(dataDirectory, `${kind}.jsonl`), line + "\n", "utf8");
}
