"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { getSessionId } from "@/lib/adminAuth";
import type { SubmissionKind, SubmissionRecord } from "@/lib/submissions";

const kinds: Array<{ kind: SubmissionKind; label: string }> = [
  { kind: "contact", label: "Contact form" },
  { kind: "register", label: "Mixed League registrations" },
  { kind: "newsletter", label: "Newsletter sign-ups" },
];

const HIDDEN = new Set(["kind", "website"]);

function columnsFor(records: SubmissionRecord[]): string[] {
  const seen = new Set<string>();
  records.forEach((r) => Object.keys(r).forEach((k) => seen.add(k)));
  HIDDEN.forEach((k) => seen.delete(k));
  const first = ["receivedAt", "name", "email", "phone"].filter((c) => seen.has(c));
  return [...first, ...[...seen].filter((c) => !first.includes(c)).sort()];
}

export default function SubmissionsPanel() {
  const [kind, setKind] = useState<SubmissionKind>("contact");
  const [records, setRecords] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/submissions/${kind}`, {
      headers: { Authorization: `Bearer ${getSessionId() ?? ""}` },
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || "Failed to load submissions");
        return data.records as SubmissionRecord[];
      })
      .then((rows) => {
        if (!cancelled) setRecords(rows);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load submissions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [kind]);

  const handleDownload = async () => {
    const response = await fetch(`/api/submissions/${kind}?format=csv`, {
      headers: { Authorization: `Bearer ${getSessionId() ?? ""}` },
    });
    if (!response.ok) {
      setError("Download failed");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `momentum-${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = columnsFor(records);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {kinds.map((k) => (
          <button
            key={k.kind}
            type="button"
            onClick={() => setKind(k.kind)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              k.kind === kind
                ? "bg-momentum-dark text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-momentum-orange"
            }`}
          >
            {k.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleDownload}
          disabled={records.length === 0}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-momentum-orange text-white font-semibold disabled:opacity-50"
        >
          <Download size={18} />
          Download CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : error ? (
          <p className="p-6 text-red-700">{error}</p>
        ) : records.length === 0 ? (
          <p className="p-6 text-gray-500">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  {columns.map((c) => (
                    <th key={c} className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                      {c === "receivedAt" ? "Received" : c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={`${r.receivedAt}-${i}`} className="border-t border-gray-100 align-top">
                    {columns.map((c) => (
                      <td key={c} className="px-4 py-3 text-gray-800 max-w-md break-words">
                        {c === "receivedAt"
                          ? new Date(r.receivedAt).toLocaleString("en-GB")
                          : String(r[c] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500">
        {records.length} {records.length === 1 ? "submission" : "submissions"}. Every form entry is
        saved here before any email is sent, so nothing is lost if email fails.
      </p>
    </div>
  );
}
