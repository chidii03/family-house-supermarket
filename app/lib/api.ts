// app/lib/api.ts
export const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "https://steveobizzstore.onrender.com").replace(/\/$/, "");

// ── Types ─────────────────────────────────────────────────────────────────────
export interface OrderData {
  customer: { name: string; email: string; phone: string; address: string; state: string };
  cart: Array<{ id: string; name: string; price: number; qty: number; image: string }>;
  totalAmount: number;
}

export interface OrderResponse {
  order_id:       string;
  reference:      string;
  customer_name:  string;
  customer_email: string;
  customer_phone: string;
  address:        string;
  state:          string;
  total_amount?:  number; 
  status:         "PENDING" | "PAID" | "SHIPPED" | "DELIVERED";
  created_at:     string;
  items?:         unknown[];
}

// ── Payment ───────────────────────────────────────────────────────────────────
export const initPayment = async (orderData: OrderData) => {
  const res = await fetch(`${API_URL}/api/payment/init`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(orderData),
  });
  return res.json();
};

// ── Order tracking ────────────────────────────────────────────────────────────
export const fetchTrackingInfo = async (id: string) => {
  const res = await fetch(`${API_URL}/api/orders/track/${id}`);
  if (!res.ok) return null;
  return res.json();
};

// ── Newsletter ────────────────────────────────────────────────────────────────
export const subscribeNewsletter = async (email: string) => {
  const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email }),
  });
  return res.json();
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminLogin = async (password: string) => {
  const res = await fetch("/api/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.json();
};

export const fetchAdminOrders = async (): Promise<OrderResponse[]> => {
  try {
    const res = await fetch(`${API_URL}/api/admin/orders`);
    if (!res.ok) {
      console.error("[fetchAdminOrders] HTTP", res.status, await res.text());
      return [];
    }
    const data = await res.json();
    // Turso may return { rows: [...] } — normalise to array
    if (Array.isArray(data))        return data;
    if (Array.isArray(data?.rows))  return data.rows;
    if (Array.isArray(data?.data))  return data.data;
    console.warn("[fetchAdminOrders] unexpected shape:", data);
    return [];
  } catch (e) {
    console.error("[fetchAdminOrders] network error:", e);
    return [];
  }
};

// FIX: was /admin/update-status — must be /api/admin/update-status
export const updateOrderStatus = async (
  orderId: string,
  status:  string
): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}/api/admin/update-status`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ orderId, status }),
    });
    if (!res.ok) {
      console.error("[updateOrderStatus] HTTP", res.status, await res.text());
    }
  } catch (e) {
    console.error("[updateOrderStatus] network error:", e);
  }
};