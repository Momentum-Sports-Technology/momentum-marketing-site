"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, LogOut, CheckCircle, AlertCircle } from "lucide-react";
import type { MixedLeagueContent } from "@/lib/content";
import { checkSession, signOut } from "@/lib/adminAuth";

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<MixedLeagueContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuthenticated = await checkSession();
    if (!isAuthenticated) {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
      fetchContent();
    }
  };

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/mixed-league");
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");

    try {
      const response = await fetch("/api/content/mixed-league", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) throw new Error("Failed to save");

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      console.error("Error saving content:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  if (loading || !authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-momentum-purple border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage Mixed League content</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        {content && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <textarea
                    value={content.hero.title}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, title: e.target.value } })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-purple focus:ring-2 focus:ring-momentum-purple/20 outline-none"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Subtitle</label>
                  <textarea
                    value={content.hero.subtitle}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-purple focus:ring-2 focus:ring-momentum-purple/20 outline-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Badge</label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-purple focus:ring-2 focus:ring-momentum-purple/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Features</h2>
              <div className="space-y-6">
                {content.features.map((feature, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <h3 className="font-semibold mb-3">Feature {feature.number}</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...content.features];
                            newFeatures[index].title = e.target.value;
                            setContent({ ...content, features: newFeatures });
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-momentum-purple outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...content.features];
                            newFeatures[index].description = e.target.value;
                            setContent({ ...content, features: newFeatures });
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-momentum-purple outline-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">FAQ</h2>
              <div className="space-y-6">
                {content.faq.items.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Question</label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => {
                            const newItems = [...content.faq.items];
                            newItems[index].question = e.target.value;
                            setContent({ ...content, faq: { ...content.faq, items: newItems } });
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-momentum-purple outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Answer</label>
                        <textarea
                          value={item.answer}
                          onChange={(e) => {
                            const newItems = [...content.faq.items];
                            newItems[index].answer = e.target.value;
                            setContent({ ...content, faq: { ...content.faq, items: newItems } });
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-momentum-purple outline-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="sticky bottom-8 flex items-center justify-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-gradient-momentum text-white px-8 py-4 rounded-full hover:shadow-2xl transition-all font-semibold text-lg disabled:opacity-50"
              >
                {saveStatus === "success" ? (
                  <>
                    <CheckCircle size={24} />
                    <span>Saved!</span>
                  </>
                ) : saveStatus === "error" ? (
                  <>
                    <AlertCircle size={24} />
                    <span>Error</span>
                  </>
                ) : (
                  <>
                    <Save size={24} />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

