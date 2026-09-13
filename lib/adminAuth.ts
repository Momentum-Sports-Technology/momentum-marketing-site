"use client";

const SESSION_KEY = "momentum_admin_session";

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionId(sessionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, sessionId);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export async function signIn(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/auth/nextauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signin", password }),
    });

    const data = await response.json();

    if (data.success && data.sessionId) {
      setSessionId(data.sessionId);
      return { success: true };
    }

    return { success: false, error: data.error || "Authentication failed" };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

export async function signOut(): Promise<void> {
  const sessionId = getSessionId();
  if (sessionId) {
    await fetch("/api/auth/nextauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signout", sessionId }),
    });
  }
  clearSession();
}

export async function checkSession(): Promise<boolean> {
  const sessionId = getSessionId();
  if (!sessionId) return false;

  try {
    const response = await fetch("/api/auth/nextauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "session", sessionId }),
    });

    const data = await response.json();
    return data.authenticated === true;
  } catch {
    return false;
  }
}
