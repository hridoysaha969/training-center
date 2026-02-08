export function resetAdmissionStorage() {
  localStorage.removeItem("adm_step1_secure");
  localStorage.removeItem("adm_step2_secure");
  localStorage.removeItem("adm_step3_secure");
}
