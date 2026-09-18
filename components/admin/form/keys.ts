// Pure helpers between the saved JSON shape and the shape the form edits.
//
// The form needs a stable identity per array item so React keys survive a
// reorder, and the saved file must not contain that identity. `withKeys` adds
// it on load, `stripForSave` takes it back out along with empty optionals.

import { KEY, type Field } from "./spec";

let counter = 0;
const nextKey = () => `k${(counter += 1)}`;

type Obj = Record<string, unknown>;

const isObject = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

/** Adds `_key` to every object inside an array, at any depth. */
export function withKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) =>
      isObject(item) ? { ...withKeys(item), [KEY]: nextKey() } : item
    ) as unknown as T;
  }
  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, withKeys(v)])
    ) as unknown as T;
  }
  return value;
}

/**
 * The saved shape: `_key` gone, and optional fields that the editor left empty
 * omitted rather than written as `""` or `false`.
 *
 * Required empty strings stay. Shop's `paymentLinkUrl` is required and an
 * empty one is what marks a product as coming soon, so blanking it must
 * survive the round trip.
 */
export function stripForSave(value: unknown, fields: Record<string, Field>): Obj {
  const source = isObject(value) ? value : {};
  const out: Obj = {};

  for (const [name, field] of Object.entries(fields)) {
    const raw = source[name];

    if (field.kind === "optionalGroup") {
      // Absent or explicitly off: the key does not appear at all.
      if (!isObject(raw)) continue;
      out[name] = stripForSave(raw, field.fields);
      continue;
    }

    if (field.kind === "group") {
      out[name] = stripForSave(raw, field.fields);
      continue;
    }

    if (field.kind === "list") {
      out[name] = (Array.isArray(raw) ? raw : []).map((item) => stripForSave(item, field.fields));
      continue;
    }

    if (field.kind === "stringList") {
      out[name] = (Array.isArray(raw) ? raw : []).map((item) => String(item ?? ""));
      continue;
    }

    out[name] = raw;
  }

  return out;
}

/** A blank item for "Add", shaped by the spec. */
export function templateFor(fields: Record<string, Field>): Obj {
  const out: Obj = { [KEY]: nextKey() };

  for (const [name, field] of Object.entries(fields)) {
    switch (field.kind) {
      case "checkbox":
        out[name] = false;
        break;
      case "list":
      case "stringList":
        out[name] = [];
        break;
      case "group":
        out[name] = templateFor(field.fields);
        break;
      case "optionalGroup":
        // Off to start with, so a new item never claims a state it has not
        // been given details for.
        out[name] = undefined;
        break;
      case "select":
        out[name] = field.allowEmpty ? "" : (field.options[0]?.value ?? "");
        break;
      default:
        out[name] = "";
    }
  }

  return out;
}

/** Reads a nested value by path, e.g. `["programmes", 2, "name"]`. */
export function getAt(value: unknown, path: Array<string | number>): unknown {
  return path.reduce<unknown>((acc, step) => {
    if (acc === null || acc === undefined) return undefined;
    return (acc as Obj)[step as string];
  }, value);
}

/** Returns a copy of `value` with `path` set to `next`. Arrays stay arrays. */
export function setAt<T>(value: T, path: Array<string | number>, next: unknown): T {
  if (path.length === 0) return next as T;

  const [step, ...rest] = path;

  if (Array.isArray(value)) {
    const index = Number(step);
    const copy = value.slice();
    copy[index] = setAt(copy[index], rest, next);
    return copy as unknown as T;
  }

  const source: Obj = isObject(value) ? value : {};
  return { ...source, [step]: setAt(source[step as string], rest, next) } as unknown as T;
}
