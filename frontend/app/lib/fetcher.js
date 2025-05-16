export default async function fetcher(path, options = {}) {
  const base = "http://localhost:4000";

  const { body, headers: extra = {}, ...rest } = options;

  const lang =
    typeof window !== "undefined" ? localStorage.getItem("lang") || "en" : "en";

  const headers = { ...extra, "Accept-Language": lang };
  const isObjBody =
    body && typeof body === "object" && !(body instanceof FormData);

  if (isObjBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const finalBody =
    isObjBody && headers["Content-Type"] === "application/json"
      ? JSON.stringify(body)
      : body;

  const res = await fetch(base + path, {
    credentials: "include",
    headers,
    body: finalBody,
    ...rest,
  }).catch((e) => {
    throw new Error("Network error: " + e.message);
  });

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
  }

  const txt = await res.text();
  const data = txt ? JSON.parse(txt) : {};
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
