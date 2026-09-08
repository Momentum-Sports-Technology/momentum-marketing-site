import fs from "fs";
import path from "path";

// Append-only JSONL log of form submissions on the data volume. This is the
// backup for when email fails, and the newsletter list until a mailing tool
// is wired in. The admin Submissions tab reads these files.

export const SUBMISSION_KINDS = ["contact", "register", "newsletter"] as const;
export type SubmissionKind = (typeof SUBMISSION_KINDS)[number];

export function isSubmissionKind(value: string): value is SubmissionKind {
  return (SUBMISSION_KINDS as readonly string[]).includes(value);
}

export type SubmissionRecord = { kind: SubmissionKind; receivedAt: string } & Record<
  string,
  unknown
>;

const dataDirectory = process.env.DATA_DIR || path.join(process.cwd(), "data");

function filePathFor(kind: SubmissionKind) {
  return path.join(dataDirectory, `${kind}.jsonl`);
}

export function appendSubmission(kind: SubmissionKind, record: object): void {
  fs.mkdirSync(dataDirectory, { recursive: true });
  const line = JSON.stringify({ kind, receivedAt: new Date().toISOString(), ...record });
  fs.appendFileSync(filePathFor(kind), line + "\n", "utf8");
}

/** Newest first. Malformed lines are skipped rather than failing the whole read. */
export function readSubmissions(kind: SubmissionKind): SubmissionRecord[] {
  const file = filePathFor(kind);
  if (!fs.existsSync(file)) return [];
  const records: SubmissionRecord[] = [];
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      records.push(JSON.parse(line));
    } catch {
      // skip
    }
  }
  return records.reverse();
}

/** Columns in a stable order per kind; anything else is appended alphabetically. */
const PREFERRED_COLUMNS: Record<SubmissionKind, string[]> = {
  contact: ["receivedAt", "name", "email", "phone", "interest", "message"],
  register: ["receivedAt", "name", "email", "phone", "experience", "message"],
  newsletter: ["receivedAt", "email"],
};

export function submissionColumns(kind: SubmissionKind, records: SubmissionRecord[]): string[] {
  const seen = new Set<string>();
  for (const r of records) Object.keys(r).forEach((k) => seen.add(k));
  seen.delete("kind");
  seen.delete("website"); // honeypot, always empty
  const preferred = PREFERRED_COLUMNS[kind].filter((c) => seen.has(c));
  const rest = [...seen].filter((c) => !preferred.includes(c)).sort();
  return [...preferred, ...rest];
}

function csvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function submissionsToCsv(kind: SubmissionKind, records: SubmissionRecord[]): string {
  const columns = submissionColumns(kind, records);
  const lines = [columns.join(",")];
  for (const r of records) lines.push(columns.map((c) => csvCell(r[c])).join(","));
  return lines.join("\r\n") + "\r\n";
}
