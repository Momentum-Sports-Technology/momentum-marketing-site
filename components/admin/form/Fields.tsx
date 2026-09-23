"use client";

import type { CheckboxField, SelectField, TextField, TextareaField } from "./spec";

export const fieldClass =
  "w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none";

function Help({ text }: { text?: string }) {
  if (!text) return null;
  return <span className="mt-1 block text-sm font-normal text-gray-500">{text}</span>;
}

export function TextInput({
  field,
  value,
  onChange,
}: {
  field: TextField;
  value: unknown;
  onChange: (next: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-2">{field.label}</span>
      <input
        value={typeof value === "string" ? value : ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
      <Help text={field.help} />
    </label>
  );
}

export function TextareaInput({
  field,
  value,
  onChange,
}: {
  field: TextareaField;
  value: unknown;
  onChange: (next: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-2">{field.label}</span>
      <textarea
        rows={field.rows ?? 3}
        value={typeof value === "string" ? value : ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
      <Help text={field.help} />
    </label>
  );
}

export function SelectInput({
  field,
  value,
  onChange,
}: {
  field: SelectField;
  value: unknown;
  onChange: (next: string | number | undefined) => void;
}) {
  // An unset optional select is `undefined` in the data but "" in the DOM.
  const current = value === undefined || value === null ? "" : String(value);

  const handleChange = (raw: string) => {
    if (raw === "") {
      onChange(undefined);
      return;
    }
    onChange(field.numeric ? Number(raw) : raw);
  };

  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-2">{field.label}</span>
      <select value={current} onChange={(e) => handleChange(e.target.value)} className={fieldClass}>
        {field.allowEmpty && <option value="">{field.emptyLabel ?? "Not set"}</option>}
        {field.options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
      <Help text={field.help} />
    </label>
  );
}

export function CheckboxInput({
  field,
  value,
  onChange,
}: {
  field: CheckboxField;
  value: unknown;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={value === true}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 rounded border-gray-300 text-momentum-orange focus:ring-momentum-orange/20"
      />
      <span className="text-sm font-semibold">
        {field.label}
        <Help text={field.help} />
      </span>
    </label>
  );
}
