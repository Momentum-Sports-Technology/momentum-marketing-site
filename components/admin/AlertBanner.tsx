"use client";

import { AlertTriangle } from "lucide-react";
import type { Alert } from "@/lib/alerts";

interface AlertBannerProps {
  alerts: Alert[];
  onDismiss: () => void;
}

/** Shown at the top of the admin panel when something needs a human. */
export default function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
      <div className="flex items-start gap-3">
        <AlertTriangle size={22} className="text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h2 className="font-semibold text-red-900 mb-2">
            {alerts.length === 1 ? "1 alert" : `${alerts.length} alerts`}
          </h2>
          <ul className="space-y-2 text-sm text-red-800">
            {alerts.slice(0, 10).map((alert) => (
              <li key={alert.at}>
                <span className="text-red-600">
                  {new Date(alert.at).toLocaleString("en-GB", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>{" "}
                {alert.detail}
              </li>
            ))}
          </ul>
          {alerts.length > 10 && (
            <p className="text-sm text-red-700 mt-2">and {alerts.length - 10} more.</p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-sm font-semibold text-red-700 hover:text-red-900 shrink-0"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
