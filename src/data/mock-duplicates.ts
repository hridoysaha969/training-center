// UI-only. Later replace with API call:
// GET /api/students/exists?n=NID_OR_BIRTH_ID

const existingNids = new Set<string>(["19990123456789012", "1234567890123"]);

export async function checkDuplicateNid(nid: string) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 400));
  return existingNids.has(nid.trim());
}
