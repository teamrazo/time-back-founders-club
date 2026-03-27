type GhlContact = {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  contactName?: string;
  tags?: string[];
};

const BASE_URL = "https://services.leadconnectorhq.com";

function getEnv(name: string) {
  return process.env[name] || "";
}

function splitName(fullName: string) {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function ghlFetch(path: string, init: RequestInit = {}) {
  const token = getEnv("GHL_PRIVATE_TOKEN");
  const version = getEnv("GHL_VERSION") || "2021-07-28";

  if (!token) throw new Error("Missing GHL_PRIVATE_TOKEN");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: version,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(10000),
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // leave as null
  }

  return { ok: res.ok, status: res.status, json, text };
}

export async function ghlHealthcheck() {
  const locationId = getEnv("GHL_LOCATION_ID");
  if (!locationId) throw new Error("Missing GHL_LOCATION_ID");

  const { ok, status, json, text } = await ghlFetch(`/locations/${locationId}`, { method: "GET" });
  if (!ok) throw new Error(`GHL healthcheck failed (${status}): ${text}`);
  return json;
}

export async function findContactByEmail(email: string) {
  const locationId = getEnv("GHL_LOCATION_ID");
  if (!locationId) throw new Error("Missing GHL_LOCATION_ID");

  const q = encodeURIComponent(email);
  const { ok, status, json, text } = await ghlFetch(`/contacts/?locationId=${locationId}&query=${q}&limit=1`, { method: "GET" });
  if (!ok) throw new Error(`Contact lookup failed (${status}): ${text}`);
  const contact = json?.contacts?.[0] as GhlContact | undefined;
  return contact || null;
}

export async function createContact(input: {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
}) {
  const locationId = getEnv("GHL_LOCATION_ID");
  if (!locationId) throw new Error("Missing GHL_LOCATION_ID");

  const { firstName, lastName } = splitName(input.fullName);

  const { ok, status, json, text } = await ghlFetch(`/contacts/`, {
    method: "POST",
    body: JSON.stringify({
      locationId,
      firstName,
      lastName,
      email: input.email,
      phone: input.phone,
      companyName: input.companyName || undefined,
    }),
  });

  if (!ok) throw new Error(`Contact create failed (${status}): ${text}`);
  return json?.contact as GhlContact;
}

export async function updateContact(contactId: string, patch: Partial<GhlContact> & { tags?: string[] }) {
  const { ok, status, json, text } = await ghlFetch(`/contacts/${contactId}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
  if (!ok) throw new Error(`Contact update failed (${status}): ${text}`);
  return json?.contact as GhlContact;
}

export async function addNoteToContact(contactId: string, note: string) {
  const { ok, status, text } = await ghlFetch(`/contacts/${contactId}/notes`, {
    method: "POST",
    body: JSON.stringify({ body: note }),
  });
  if (!ok) console.warn(`Note add failed (${status}): ${text}`);
  return ok;
}

export async function upsertContactAndTag(input: {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  tagsToAdd: string[];
  customFields?: { key: string; field_value: string }[];
  note?: string;
  source?: string;
}) {
  const existing = await findContactByEmail(input.email);

  if (!existing) {
    const created = await createContact(input);
    const updatePayload: Record<string, unknown> = {
      tags: Array.from(new Set([...(created.tags || []), ...input.tagsToAdd])),
    };
    if (input.source) updatePayload.source = input.source;
    if (input.customFields) updatePayload.customFields = input.customFields;
    await updateContact(created.id, updatePayload as any);
    if (input.note) await addNoteToContact(created.id, input.note);
    return { contactId: created.id, created: true };
  }

  const mergedTags = Array.from(new Set([...(existing.tags || []), ...input.tagsToAdd]));
  const updatePayload: Record<string, unknown> = {
    email: input.email,
    phone: input.phone,
    tags: mergedTags,
  };
  if (input.source) updatePayload.source = input.source;
  if (input.customFields) updatePayload.customFields = input.customFields;
  await updateContact(existing.id, updatePayload as any);
  if (input.note) await addNoteToContact(existing.id, input.note);

  return { contactId: existing.id, created: false };
}
