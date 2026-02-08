export async function hashPayload(payload: any) {
  const msg = JSON.stringify(payload);
  const buf = new TextEncoder().encode(msg);

  const hashBuffer = await crypto.subtle.digest("SHA-256", buf);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
