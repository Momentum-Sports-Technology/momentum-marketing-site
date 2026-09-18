"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { CheckboxInput, SelectInput, TextInput, TextareaInput, fieldClass } from "./Fields";
import { templateFor } from "./keys";
import { KEY, type Field } from "./spec";

type Path = Array<string | number>;

export interface FieldCallbacks {
  onChange: (path: Path, next: unknown) => void;
  onAdd: (path: Path, itemFields?: Record<string, Field>) => void;
  onRemove: (path: Path, index: number) => void;
  onMove: (path: Path, index: number, direction: -1 | 1) => void;
}

interface FieldsetProps extends FieldCallbacks {
  fields: Record<string, Field>;
  value: unknown;
  path: Path;
}

/** Every field of one object, in spec order. */
export function Fieldset({ fields, value, path, ...callbacks }: FieldsetProps) {
  const source = (value ?? {}) as Record<string, unknown>;

  return (
    <div className="space-y-5">
      {Object.entries(fields).map(([name, field]) => (
        <FieldRenderer
          key={name}
          field={field}
          value={source[name]}
          path={[...path, name]}
          {...callbacks}
        />
      ))}
    </div>
  );
}

interface FieldRendererProps extends FieldCallbacks {
  field: Field;
  value: unknown;
  path: Path;
}

export function FieldRenderer({ field, value, path, ...callbacks }: FieldRendererProps) {
  const { onChange, onAdd, onRemove, onMove } = callbacks;

  switch (field.kind) {
    case "text":
      return <TextInput field={field} value={value} onChange={(v) => onChange(path, v)} />;

    case "textarea":
      return <TextareaInput field={field} value={value} onChange={(v) => onChange(path, v)} />;

    case "select":
      return <SelectInput field={field} value={value} onChange={(v) => onChange(path, v)} />;

    case "checkbox":
      return <CheckboxInput field={field} value={value} onChange={(v) => onChange(path, v)} />;

    case "group":
      return (
        <fieldset className="rounded-xl border border-gray-200 p-5">
          <legend className="px-2 text-sm font-semibold">{field.label}</legend>
          {field.help && <p className="mb-4 text-sm text-gray-500">{field.help}</p>}
          <Fieldset fields={field.fields} value={value} path={path} {...callbacks} />
        </fieldset>
      );

    case "optionalGroup": {
      const on = value !== undefined && value !== null;
      return (
        <fieldset className="rounded-xl border border-gray-200 p-5">
          <legend className="px-2 text-sm font-semibold">{field.label}</legend>
          <label className="mb-4 flex items-start gap-3">
            <input
              type="checkbox"
              checked={on}
              onChange={(e) =>
                onChange(path, e.target.checked ? templateFor(field.fields) : undefined)
              }
              className="mt-1 h-5 w-5 rounded border-gray-300 text-momentum-orange focus:ring-momentum-orange/20"
            />
            <span className="text-sm font-semibold">
              {field.toggleLabel}
              {field.help && (
                <span className="mt-1 block font-normal text-gray-500">{field.help}</span>
              )}
            </span>
          </label>
          {on && <Fieldset fields={field.fields} value={value} path={path} {...callbacks} />}
        </fieldset>
      );
    }

    case "stringList": {
      const items = Array.isArray(value) ? value : [];
      return (
        <div>
          <p className="text-sm font-semibold mb-2">{field.label}</p>
          {field.help && <p className="mb-3 text-sm text-gray-500">{field.help}</p>}
          <div className="space-y-3">
            {items.map((item, index) => (
              // Plain strings have no identity of their own, so the index is
              // the only key available. Safe here because these rows hold a
              // single control with no state below it.
              <div key={index} className="flex items-start gap-2">
                <textarea
                  rows={field.rows ?? 2}
                  value={typeof item === "string" ? item : ""}
                  onChange={(e) => onChange([...path, index], e.target.value)}
                  className={fieldClass}
                />
                <ItemButtons
                  index={index}
                  count={items.length}
                  onRemove={() => onRemove(path, index)}
                  onMove={(direction) => onMove(path, index, direction)}
                />
              </div>
            ))}
          </div>
          <AddButton label={`Add ${field.itemName.toLowerCase()}`} onClick={() => onAdd(path)} />
        </div>
      );
    }

    case "list": {
      const items = (Array.isArray(value) ? value : []) as Array<Record<string, unknown>>;
      const atMinimum = items.length <= (field.minItems ?? 0);

      return (
        <div>
          <p className="text-sm font-semibold mb-2">{field.label}</p>
          {field.help && <p className="mb-3 text-sm text-gray-500">{field.help}</p>}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={String(item[KEY] ?? index)}
                className="rounded-xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h4 className="font-semibold">
                    {field.itemLabel?.(item) || `${field.itemName} ${index + 1}`}
                  </h4>
                  <ItemButtons
                    index={index}
                    count={items.length}
                    disableRemove={atMinimum}
                    removeTitle={
                      atMinimum
                        ? `At least one ${field.itemName.toLowerCase()} is required`
                        : undefined
                    }
                    onRemove={() => onRemove(path, index)}
                    onMove={(direction) => onMove(path, index, direction)}
                  />
                </div>
                <Fieldset
                  fields={field.fields}
                  value={item}
                  path={[...path, index]}
                  {...callbacks}
                />
              </div>
            ))}
          </div>
          <AddButton
            label={`Add ${field.itemName.toLowerCase()}`}
            onClick={() => onAdd(path, field.fields)}
          />
        </div>
      );
    }
  }
}

function ItemButtons({
  index,
  count,
  disableRemove,
  removeTitle,
  onRemove,
  onMove,
}: {
  index: number;
  count: number;
  disableRemove?: boolean;
  removeTitle?: string;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const buttonClass =
    "rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:border-momentum-orange hover:text-momentum-orange disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-600";

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        aria-label="Move up"
        className={buttonClass}
      >
        <ChevronUp size={18} />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={index === count - 1}
        aria-label="Move down"
        className={buttonClass}
      >
        <ChevronDown size={18} />
      </button>
      <button
        type="button"
        onClick={onRemove}
        disabled={disableRemove}
        title={removeTitle}
        aria-label="Remove"
        className={`${buttonClass} hover:border-red-400 hover:text-red-600`}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-400 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-momentum-orange hover:text-momentum-orange"
    >
      <Plus size={16} />
      {label}
    </button>
  );
}
