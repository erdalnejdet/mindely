/** Pull a user-visible error string from typical API / BFF JSON bodies. */

function nonEmptyString(v: unknown): string | null {
  if (typeof v === "string") {
    const t = v.trim();
    return t.length ? t : null;
  }
  return null;
}

type ZodFlattenLike = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[] | undefined>;
};

function messageFromZodDetails(details: unknown): string | null {
  if (!details || typeof details !== "object") return null;
  const d = details as ZodFlattenLike;
  const form = (d.formErrors ?? []).filter(Boolean);
  const fieldBits: string[] = [];
  if (d.fieldErrors && typeof d.fieldErrors === "object") {
    for (const [key, arr] of Object.entries(d.fieldErrors)) {
      if (Array.isArray(arr) && arr.length) {
        fieldBits.push(`${key}: ${arr.join(", ")}`);
      }
    }
  }
  const parts = [...form, ...fieldBits];
  return parts.length ? parts.join(" ") : null;
}

export function messageFromApiErrorJson(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const o = data as Record<string, unknown>;

  const top = nonEmptyString(o.message) ?? nonEmptyString(o.msg);
  if (top) return top;

  const nestedErr = o.error;
  if (nestedErr && typeof nestedErr === "object") {
    const ne = nestedErr as Record<string, unknown>;
    const nested = nonEmptyString(ne.message) ?? nonEmptyString(ne.msg);
    if (nested) return nested;
  }

  const fromDetails = messageFromZodDetails(o.details);
  if (fromDetails) return fromDetails;

  const err = o.error;
  if (typeof err === "string") {
    const t = err.trim();
    if (t.length > 2 && /\s/.test(t)) return t;
  }

  return fallback;
}
