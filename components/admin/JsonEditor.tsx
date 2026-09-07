"use client";

import { useState } from "react";
import SaveButton from "@/components/admin/SaveButton";
import type { SaveState } from "@/components/admin/types";

interface JsonEditorProps {
  initial: unknown;
  saveState: SaveState;
  onSave: (next: unknown) => void;
}

/**
 * Structured-text editor for content files. The server validates against the
 * file's schema on save and returns field-level messages, shown under the
 * button. JSON syntax errors are caught here before submitting.
 */
export default function JsonEditor({ initial, saveState, onSave }: JsonEditorProps) {
  const [text, setText] = useState(() => JSON.stringify(initial, null, 2));

  const parseError = (() => {
    try {
      JSON.parse(text);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Invalid JSON";
    }
  })();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="w-full min-h-[70vh] font-mono text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none"
        />
        {parseError && <p className="mt-3 text-sm text-red-700">JSON error: {parseError}</p>}
      </div>
      <SaveButton
        saveState={saveState}
        disabled={parseError !== null}
        onClick={() => onSave(JSON.parse(text))}
      />
    </div>
  );
}
