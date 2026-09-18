"use client";

import { useState } from "react";
import type { ZodType } from "zod";
import { getAt, setAt, stripForSave, templateFor, withKeys } from "@/components/admin/form/keys";
import type { Field } from "@/components/admin/form/spec";

type Path = Array<string | number>;

/**
 * Form state for one content file.
 *
 * The editor works on the content object itself, with a `_key` on every array
 * item for React. `handleSubmit` strips those, validates against the file's
 * own schema, and only then hands the result up to be saved, so a mistake
 * surfaces in the form rather than as a failed request.
 *
 * Mount this per slug with `key={slug}` so switching tabs remounts rather
 * than syncing state from props.
 */
export function useContentForm<T>(
  initial: T,
  fields: Record<string, Field>,
  schema: ZodType<unknown>,
  onSave: (next: unknown) => void
) {
  const [value, setValue] = useState<T>(() => withKeys(initial));
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = (next: T) => {
    setValue(next);
    setDirty(true);
    setError(null);
  };

  const handleChange = (path: Path, next: unknown) => change(setAt(value, path, next));

  const handleAdd = (path: Path, itemFields?: Record<string, Field>) => {
    const list = (getAt(value, path) as unknown[]) ?? [];
    const item = itemFields ? templateFor(itemFields) : "";
    change(setAt(value, path, [...list, item]));
  };

  const handleRemove = (path: Path, index: number) => {
    const list = (getAt(value, path) as unknown[]) ?? [];
    change(
      setAt(
        value,
        path,
        list.filter((_, i) => i !== index)
      )
    );
  };

  const handleMove = (path: Path, index: number, direction: -1 | 1) => {
    const list = ((getAt(value, path) as unknown[]) ?? []).slice();
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    change(setAt(value, path, list));
  };

  /** Replaces everything, for the advanced JSON view handing control back. */
  const handleReplace = (next: unknown) => change(withKeys(next as T));

  const handleSubmit = () => {
    const payload = stripForSave(value, fields);
    const result = schema.safeParse(payload);
    if (!result.success) {
      setError(
        result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("\n")
      );
      return;
    }
    setError(null);
    setDirty(false);
    onSave(result.data);
  };

  return {
    value,
    dirty,
    error,
    handleChange,
    handleAdd,
    handleRemove,
    handleMove,
    handleReplace,
    handleSubmit,
  };
}
