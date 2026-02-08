function decode(value: string | null) {
  if (!value) return null;
  try {
    const json = decodeURIComponent(escape(atob(value)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function collectAdmissionData() {
  const s1 = decode(localStorage.getItem("adm_step1_secure"));
  const s2 = decode(localStorage.getItem("adm_step2_secure"));
  const s3 = decode(localStorage.getItem("adm_step3_secure"));

  return {
    student: s1,
    guardian: s2,
    academic: s3,
    createdAt: new Date().toISOString(),
  };
}
