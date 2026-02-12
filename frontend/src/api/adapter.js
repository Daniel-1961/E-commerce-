// src/api/adapter.js
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

// simulate small network delay
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getProducts({ q = "", category_id = null, page = 1, limit = 12 } = {}) {
  if (USE_MOCKS) {
    const json = await import("../mock/products.json");
    await sleep(250);
    let list = json.default.data;

    // simple search filter
    if (q && q.trim()) {
      const term = q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(term) || (p.description || "").toLowerCase().includes(term));
    }

    // category filter
    if (category_id) {
      list = list.filter(p => Number(p.category_id) === Number(category_id));
    }

    // simple pagination (slice)
    const start = (page - 1) * limit;
    const paged = list.slice(start, start + limit);

    return { data: paged, meta: { total: list.length, page, limit } };
  }

  // real API path (if later switched)
  const url = `${import.meta.env.VITE_API_BASE}/products?page=${page}&limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ""}${category_id ? `&category_id=${category_id}` : ""}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export async function getProductById(id) {
  if (USE_MOCKS) {
    const json = await import("../mock/products.json");
    await sleep(150);
    const p = (json.default.data || []).find(x => Number(x.id) === Number(id));
    return { data: p || null };
  }
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/products/${id}`);
  return await res.json();
}
//login handler
export async function login(body) {
 const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if(!json.success){
    throw new Error(json.message||"Login failed");

  }
  return json.data;//{user,token};

}

// src/api/adapter.js
export async function register(body) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // backend returns { success, message, data: { user, token } }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Registration failed");
  }
  return json.data; // { user, token }
}


