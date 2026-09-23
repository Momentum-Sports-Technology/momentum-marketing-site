"use client";

import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import type { ZodType } from "zod";
import SaveButton from "@/components/admin/SaveButton";
import type { SaveState } from "@/components/admin/types";
import { Fieldset } from "@/components/admin/form/FieldRenderer";
import { stripForSave } from "@/components/admin/form/keys";
import type { Field } from "@/components/admin/form/spec";
import { useContentForm } from "@/hooks/useContentForm";

interface ContentEditorProps {
  initial: unknown;
  fields: Record<string, Field>;
  schema: ZodType<unknown>;
  saveState: SaveState;
  onSave: (next: unknown) => void;
  onDirtyChange: (dirty: boolean) => void;
}

/**
 * One content file, as a form. Mount with `key={slug}` so a tab change
 * remounts rather than syncing state from props.
 */
export default function ContentEditor({
  initial,
  fields,
  schema,
  saveState,
  onSave,
  onDirtyChange,
}: ContentEditorProps) {
  const form = useContentForm(initial, fields, schema, onSave);
  const [advanced, setAdvanced] = useState(false);

  useEffect(() => {
    onDirtyChange(form.dirty);
  }, [form.dirty, onDirtyChange]);

  // Save errors come from two places and read the same way: the client check
  // in the hook, and the server's reply.
  const state: SaveState = form.error ? { status: "error", message: form.error } : saveState;

  return (
    <div className="space-y-8">
      {advanced ? (
        <JsonPanel value={stripForSave(form.value, fields)} onApply={form.handleReplace} />
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Fieldset
            fields={fields}
            value={form.value}
            path={[]}
            onChange={form.handleChange}
            onAdd={form.handleAdd}
            onRemove={form.handleRemove}
            onMove={form.handleMove}
          />
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setAdvanced(!advanced)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-momentum-orange"
        >
          <Code2 size={16} />
          {advanced ? "Back to the form" : "Advanced: edit as JSON"}
        </button>
      </div>

      <SaveButton saveState={state} disabled={!form.dirty} onClick={form.handleSubmit} />
    </div>
  );
}

/**
 * The escape hatch, for a field the form does not cover. Edits here are
 * applied into the same form state, so the Save button still validates them.
 */
function JsonPanel({ value, onApply }: { value: unknown; onApply: (next: unknown) => void }) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));

  const parseError = (() => {
    try {
      JSON.parse(text);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Invalid JSON";
    }
  })();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="w-full min-h-[60vh] font-mono text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none"
      />
      {parseError && <p className="mt-3 text-sm text-red-700">JSON error: {parseError}</p>}
      <button
        type="button"
        onClick={() => onApply(JSON.parse(text))}
        disabled={parseError !== null}
        className="mt-4 rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
      >
        Apply to the form
      </button>
    </div>
  );
}
