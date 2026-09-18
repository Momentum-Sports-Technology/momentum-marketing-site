"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { checkSession, getSessionId, signOut } from "@/lib/adminAuth";
import { contentFiles, type ContentSlug } from "@/lib/schemas";
import ContentEditor from "@/components/admin/ContentEditor";
import { specs } from "@/components/admin/specs";
import type { SaveState } from "@/components/admin/types";
import SubmissionsPanel from "@/components/admin/SubmissionsPanel";
import AlertBanner from "@/components/admin/AlertBanner";
import { useAlerts } from "@/hooks/useAlerts";

type TabSlug = ContentSlug | "submissions";

const tabs: Array<{ slug: TabSlug; label: string; hint: string }> = [
  {
    slug: "site",
    label: "Homepage & site",
    hint: "Hero, programmes, venues, events, reviews, FAQ, fixtures",
  },
  { slug: "mixed-league", label: "Mixed League", hint: "The /mixed page" },
  {
    slug: "basingstoke",
    label: "Basingstoke",
    hint: "The /basingstoke page: intro, booking details, interest form copy",
  },
  {
    slug: "players-of-the-season",
    label: "Players of the Season",
    hint: "Divisions, seasons, winners",
  },
  { slug: "code-of-conduct", label: "Code of Conduct", hint: "Sections and rules" },
  { slug: "shop", label: "Shop", hint: "Products and Stripe Payment Links" },
  { slug: "links", label: "Links", hint: "The /links page used in the Instagram bio" },
  {
    slug: "submissions",
    label: "Submissions",
    hint: "Contact form, registrations and newsletter sign-ups",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [activeSlug, setActiveSlug] = useState<TabSlug>("site");
  // Content is stored with the slug it was loaded for, so an editor never
  // renders another tab's data during the switch.
  const [loaded, setLoaded] = useState<{ slug: ContentSlug; data: unknown } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });
  const [dirty, setDirty] = useState(false);
  // A tab the editor is holding back until unsaved edits are dealt with.
  const [pendingSlug, setPendingSlug] = useState<TabSlug | null>(null);
  const { alerts, handleDismiss: handleDismissAlerts } = useAlerts(authenticated);

  useEffect(() => {
    let cancelled = false;
    checkSession().then((ok) => {
      if (cancelled) return;
      if (!ok) router.push("/admin/login");
      else setAuthenticated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!authenticated || activeSlug === "submissions") return;
    let cancelled = false;
    setLoading(true);
    setSaveState({ status: "idle" });
    fetch(`/api/content/${activeSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setLoaded({ slug: activeSlug as ContentSlug, data });
      })
      .catch((error) => console.error("Error fetching content:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authenticated, activeSlug]);

  // Closing the tab with unsaved edits should cost a confirmation.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const handleSave = async (next: unknown) => {
    setSaveState({ status: "saving" });
    try {
      const response = await fetch(`/api/content/${activeSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getSessionId() ?? ""}`,
        },
        body: JSON.stringify(next),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const issues = Array.isArray(data.issues) ? `\n${data.issues.join("\n")}` : "";
        throw new Error(`${data.error || "Failed to save"}${issues}`);
      }
      setLoaded({ slug: activeSlug as ContentSlug, data: next });
      setDirty(false);
      setSaveState({ status: "saved" });
    } catch (error) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to save",
      });
    }
  };

  const handleSelectTab = (slug: TabSlug) => {
    if (slug === activeSlug) return;
    if (dirty) {
      setPendingSlug(slug);
      return;
    }
    setActiveSlug(slug);
  };

  const handleDiscard = () => {
    if (pendingSlug === null) return;
    setDirty(false);
    setActiveSlug(pendingSlug);
    setPendingSlug(null);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-momentum-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeTab = tabs.find((t) => t.slug === activeSlug) ?? tabs[0];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1">Admin</h1>
            <p className="text-gray-600">Edit site content. Changes go live as soon as you save.</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign out</span>
          </button>
        </div>

        <AlertBanner alerts={alerts} onDismiss={handleDismissAlerts} />

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              onClick={() => handleSelectTab(tab.slug)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                tab.slug === activeSlug
                  ? "bg-momentum-orange text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-momentum-orange"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {pendingSlug !== null && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 px-6 py-4">
            <p className="font-semibold text-amber-900">
              You have unsaved changes on {activeTab.label}.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPendingSlug(null)}
                className="rounded-lg bg-white px-5 py-2 font-semibold text-gray-700 border border-gray-300"
              >
                Stay here
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                className="rounded-lg bg-amber-600 px-5 py-2 font-semibold text-white hover:bg-amber-700"
              >
                Discard and switch
              </button>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6">{activeTab.hint}</p>

        {activeSlug === "submissions" ? (
          <SubmissionsPanel />
        ) : loading || loaded === null || loaded.slug !== activeSlug ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <ContentEditor
            key={activeSlug}
            initial={loaded.data}
            fields={specs[activeSlug as ContentSlug]}
            schema={contentFiles[activeSlug as ContentSlug]}
            saveState={saveState}
            onSave={handleSave}
            onDirtyChange={setDirty}
          />
        )}
      </div>
    </div>
  );
}
