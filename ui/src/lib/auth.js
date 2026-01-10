export function getToken() {
  return localStorage.getItem("imc_token");
}

export function clearToken() {
  localStorage.removeItem("imc_token");
}

export function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getRoleFromToken() {
  const t = getToken();
  if (!t) return "";
  const claims = parseJwt(t);
  return (claims?.role || "").toLowerCase();
}
