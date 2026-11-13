import { authClient } from "@/lib/auth-client";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function getToken() {
  const { data } = await authClient.token();
  return data?.token || null;
}

/**
 * Small fetch wrapper for the Express API.
 * auth: true attaches the BetterAuth-issued JWT as a Bearer token.
 */
export async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = await getToken();
    if (!token) throw new Error("Please log in to continue.");
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

export async function uploadImage(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("Image upload is not configured. Add NEXT_PUBLIC_IMGBB_KEY.");
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.data?.url) throw new Error("Image upload failed. Please try a different image.");
  return data.data.url;
}

export const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "-";
