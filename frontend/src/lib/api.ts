import Cookies from "js-cookie";

const BASE_URL = "http://localhost:8000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = Cookies.get("token");

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    // if (res.status === 401) {
    //   Cookies.remove("token");
    //   window.location.href = "/login";
    //   return;
    // }

    return res;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
}
