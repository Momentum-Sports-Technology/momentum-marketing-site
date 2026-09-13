"use client";

import { useEffect, useState } from "react";
import { getSessionId } from "@/lib/adminAuth";
import type { Alert } from "@/lib/alerts";

/** Outstanding admin alerts. Loads once the panel is authenticated. */
export function useAlerts(authenticated: boolean) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    fetch("/api/alerts", { headers: { Authorization: `Bearer ${getSessionId() ?? ""}` } })
      .then((r) => (r.ok ? r.json() : { alerts: [] }))
      .then((data) => {
        if (!cancelled) setAlerts(data.alerts ?? []);
      })
      .catch(() => {
        // An alerts outage must not break the editor.
      });
    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  const handleDismiss = async () => {
    setAlerts([]);
    await fetch("/api/alerts", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getSessionId() ?? ""}` },
    }).catch(() => {
      // Already cleared on screen; it reappears on the next load if this failed.
    });
  };

  return { alerts, handleDismiss };
}
