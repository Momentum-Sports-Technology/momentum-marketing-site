// Field specs: how a content file is presented in the admin form.
//
// One spec per content file, each entry describing a field in plain English.
// `SpecFor<T>` requires an entry for every key of the parsed content type, so
// adding a field to a schema in lib/schemas.ts without labelling it here fails
// the build rather than quietly vanishing from the admin.

/** Injected into every array item on load, stripped before save. React keys only. */
export const KEY = "_key";

export interface BaseField {
  label: string;
  /** Shown under the control. Say what the field does, not what it is. */
  help?: string;
}

export interface TextField extends BaseField {
  kind: "text";
  placeholder?: string;
}

export interface TextareaField extends BaseField {
  kind: "textarea";
  rows?: number;
  placeholder?: string;
}

export interface SelectField extends BaseField {
  kind: "select";
  options: Array<{ value: string | number; label: string }>;
  /** Adds a blank option. `emptyLabel` says what leaving it blank means. */
  allowEmpty?: boolean;
  emptyLabel?: string;
  /** Store the chosen value as a number. For ratings and the like. */
  numeric?: boolean;
}

export interface CheckboxField extends BaseField {
  kind: "checkbox";
}

/** A nested object that is always present. */
export interface GroupField extends BaseField {
  kind: "group";
  fields: Record<string, Field>;
}

/**
 * A nested object the file can do without, rendered with an on/off toggle.
 * Off means the key is absent from the saved file.
 */
export interface OptionalGroupField extends BaseField {
  kind: "optionalGroup";
  /** Shown beside the toggle, e.g. "Booking is open". */
  toggleLabel: string;
  fields: Record<string, Field>;
}

/** An array of objects, each rendered as a card with its own fields. */
export interface ListField extends BaseField {
  kind: "list";
  /** Heading for one item, e.g. "Programme". Used for "Add programme" too. */
  itemName: string;
  fields: Record<string, Field>;
  /** Names the card from its own content, so a long list stays navigable. */
  itemLabel?: (item: Record<string, unknown>) => string;
  /** Refuse to remove the last item. Set where the schema says `.min(1)`. */
  minItems?: number;
}

/** An array of plain strings, e.g. a paragraph list or a set of rules. */
export interface StringListField extends BaseField {
  kind: "stringList";
  itemName: string;
  rows?: number;
}

export type Field =
  | TextField
  | TextareaField
  | SelectField
  | CheckboxField
  | GroupField
  | OptionalGroupField
  | ListField
  | StringListField;

/**
 * Requires one field entry per key of `T`. The value side is deliberately
 * loose: the mapped type is here to catch a missing or misspelled key, which
 * is the failure that actually happens when a schema changes.
 */
export type SpecFor<T> = { [K in keyof Required<T>]: Field };
