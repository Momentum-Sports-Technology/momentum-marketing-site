"use client";

import { useState } from "react";
import type { MixedLeagueContent } from "@/lib/content";
import SaveButton from "@/components/admin/SaveButton";
import type { SaveState } from "@/components/admin/types";

interface MixedLeagueEditorProps {
  initial: MixedLeagueContent;
  saveState: SaveState;
  onSave: (next: MixedLeagueContent) => void;
}

const fieldClass =
  "w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none";

export default function MixedLeagueEditor({ initial, saveState, onSave }: MixedLeagueEditorProps) {
  const [content, setContent] = useState<MixedLeagueContent>(initial);

  const updateFeature = (index: number, patch: Partial<MixedLeagueContent["features"][number]>) => {
    setContent({
      ...content,
      features: content.features.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    });
  };

  const updateFaq = (index: number, patch: Partial<MixedLeagueContent["faq"]["items"][number]>) => {
    setContent({
      ...content,
      faq: {
        ...content.faq,
        items: content.faq.items.map((f, i) => (i === index ? { ...f, ...patch } : f)),
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Hero</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm font-semibold mb-2">Title</span>
            <textarea
              rows={2}
              value={content.hero.title}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, title: e.target.value } })
              }
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-2">Subtitle</span>
            <textarea
              rows={3}
              value={content.hero.subtitle}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })
              }
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-2">Badge</span>
            <input
              value={content.hero.badge ?? ""}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })
              }
              className={fieldClass}
            />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="space-y-6">
          {content.features.map((feature, index) => (
            <div
              key={feature.number}
              className="border-b border-gray-200 pb-6 last:border-0 space-y-3"
            >
              <h3 className="font-semibold">Feature {feature.number}</h3>
              <input
                value={feature.title}
                onChange={(e) => updateFeature(index, { title: e.target.value })}
                className={fieldClass}
              />
              <textarea
                rows={2}
                value={feature.description}
                onChange={(e) => updateFeature(index, { description: e.target.value })}
                className={fieldClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <div className="space-y-6">
          {content.faq.items.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-0 space-y-3">
              <input
                value={item.question}
                onChange={(e) => updateFaq(index, { question: e.target.value })}
                className={fieldClass}
              />
              <textarea
                rows={3}
                value={item.answer}
                onChange={(e) => updateFaq(index, { answer: e.target.value })}
                className={fieldClass}
              />
            </div>
          ))}
        </div>
      </div>

      <SaveButton saveState={saveState} onClick={() => onSave(content)} />
    </div>
  );
}
