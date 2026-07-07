// app/admin/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { fetchAdminOrders, updateOrderStatus, adminLogin, OrderResponse,} from "@/app/lib/api";
import { X, LayoutDashboard, Package, LogOut, RefreshCw, Eye, CheckCircle, Truck, MapPin, AlertCircle,} from "lucide-react";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password,        setPassword]        = useState("");
  const [loginLoading,    setLoginLoading]    = useState(false);
  const [orders,          setOrders]          = useState<OrderResponse[]>([]);
  const [ordersLoading,   setOrdersLoading]   = useState(false);
  const [fetchError,      setFetchError]      = useState("");
  const [selectedOrder,   setSelectedOrder]   = useState<OrderResponse | null>(null);

  // ── Load orders with visible error handling ──────────────────────────────
  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setFetchError("");
    try {
      const data = await fetchAdminOrders();
      if (data.length === 0) {
        // Could be empty DB or a silent API error — show warning so user knows
        setFetchError(
          "No orders found. If you've made payments, open browser DevTools → Console to see API errors."
        );
      }
      setOrders(data);
    } catch {
      setFetchError("Failed to load orders. Check DevTools Console for details.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Auto-refresh every 30s when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    loadOrders();
    const interval = setInterval(loadOrders, 30_000);
    return () => clearInterval(interval);
  }, [isAuthenticated, loadOrders]);

  const handleLogin = async () => {
    if (!password) { toast.error("Enter your password"); return; }
    setLoginLoading(true);
    const res = await adminLogin(password);
    setLoginLoading(false);
    if (res.success) {
      setIsAuthenticated(true);
      toast.success("Welcome back!");
    } else {
      toast.error("Invalid credentials — check password and DevTools Console");
    }
  };

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl w-full max-w-md">
          <div className="text-center mb-6">
            <div className="bg-(--prim-color,#6366f1) w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <LayoutDashboard className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black text-(--prim-color,#6366f1) uppercase tracking-tighter">
              Family House HQ
            </h2>
            <p className="mt-2 font-semibold text-white/70">Secure administrative gateway</p>
          </div>
          <input
            type="password"
            placeholder="Access Key"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-black mb-6 focus:ring-2 focus:ring-(--prim-color,#6366f1) outline-none transition-all"
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full bg-(--prim-color,#6366f1) text-white py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm disabled:opacity-60"
          >
            {loginLoading ? "Checking…" : "Enter Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const pendingCount = orders.filter(o => o.status === "PAID").length;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <main className="p-6 lg:p-10 overflow-x-hidden">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Command Center</h1>
            <p className="text-gray-500 font-medium">Manage and track store performance</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              disabled={ordersLoading}
              className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-60"
            >
              <RefreshCw size={16} className={ordersLoading ? "animate-spin" : ""} />
              {ordersLoading ? "Loading…" : "Sync"}
            </button>
            <button
              onClick={() => { setIsAuthenticated(false); setOrders([]); }}
              className="bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-red-700 transition-all active:scale-95"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* Debug hint if orders are empty */}
        {fetchError && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 mb-8 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold mb-1">Orders not showing?</p>
              <p>{fetchError}</p>
              <p className="mt-2 text-xs text-amber-600">
                Also visit:{" "}
                <a
                href="https://familyhousesupermarket.com/api/admin/debug"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold"
                >
                  /api/admin/debug
                </a>{" "}
                to see raw database rows.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Orders", value: orders.length,              icon: Package,     color: "bg-blue-500"   },
            { label: "Revenue",      value: `₦${totalRevenue.toLocaleString()}`, icon: CheckCircle, color: "bg-green-500"  },
            { label: "Pending",      value: pendingCount,               icon: Truck,       color: "bg-orange-500" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className={`${s.color} p-4 rounded-xl text-white`}>
                <s.icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-black">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {ordersLoading && orders.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <RefreshCw size={20} className="animate-spin mr-3" /> Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Package size={40} className="opacity-30" />
              <p className="font-bold">No orders yet</p>
              <p className="text-sm text-center max-w-sm px-4">
                Orders appear here after a successful Paystack payment. Check the{" "}
                <a
                  href="https://familyhousesupermarket.com/api/admin/debug"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  debug endpoint
                </a>{" "}
                to verify database connectivity.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black text-white text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
                  <tr>
                    <th className="p-5">Track ID</th>
                    <th className="p-5">Customer</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Amount</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {orders.map(order => (
                    <tr key={order.order_id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-5 font-black text-(--prim-color,#6366f1)">{order.order_id}</td>
                      <td className="p-5">
                        <div className="font-black text-gray-900 uppercase text-xs">{order.customer_name}</div>
                        <div className="flex items-center gap-1 text-gray-500 text-[11px] mt-1">
                          {order.customer_email}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                         {order.customer_phone}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1 font-bold text-gray-700 uppercase text-[11px]">
                          <MapPin size={10} /> {order.state}
                        </div>
                        <div className="text-gray-400 text-[10px] truncate max-w-37.5">
                          {order.address}
                        </div>
                      </td>
                      <td className="p-5 font-black text-lg">
                       ₦{order.total_amount ? Number(order.total_amount).toLocaleString() : "0"}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                          order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                          order.status === "SHIPPED"   ? "bg-blue-100 text-blue-700"   :
                          order.status === "PAID"      ? "bg-orange-100 text-orange-700" :
                                                         "bg-gray-100 text-gray-600"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 bg-red-50 text-(--prim-color) rounded-lg hover:bg-(--prim-color) hover:text-white transition-all"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {order.status !== "SHIPPED" && order.status !== "DELIVERED" && (
                            <button
                              onClick={() => updateOrderStatus(order.order_id, "SHIPPED").then(loadOrders)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-[10px] uppercase px-3 hover:bg-blue-100 transition-all"
                            >
                              Ship
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="font-black text-2xl uppercase">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs uppercase font-black text-gray-400 mb-1 tracking-widest">Order ID</p>
                  <p className="font-bold text-sm text-(--prim-color,#6366f1)">{selectedOrder.order_id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs uppercase font-black text-gray-400 mb-1 tracking-widest">Amount</p>
                  <p className="font-black text-xl">₦{selectedOrder.total_amount ? Number(selectedOrder.total_amount).toLocaleString() :"0" }</p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl mb-4">
                <p className="text-xs uppercase font-black text-gray-400 mb-2 tracking-widest">Customer</p>
                <p className="font-bold text-gray-900">{selectedOrder.customer_name}</p>
                <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">{selectedOrder.customer_email}</p>
                <p className="text-gray-600 text-sm flex items-center gap-1">{selectedOrder.customer_phone}</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl mb-6">
                <p className="text-xs uppercase font-black text-gray-400 mb-2 tracking-widest">Shipping To</p>
                <p className="font-bold text-gray-900">{selectedOrder.address}</p>
              </div>

              <div className="flex gap-3">
                {selectedOrder.status !== "DELIVERED" && (
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.order_id, "DELIVERED").then(() => {
                        loadOrders();
                        setSelectedOrder(null);
                        toast.success("Marked as delivered");
                      })
                    }
                    className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-green-700 transition-all"
                  >
                    Mark as Delivered
                  </button>
                )}
                {selectedOrder.status === "PAID" && (
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.order_id, "SHIPPED").then(() => {
                        loadOrders();
                        setSelectedOrder(null);
                        toast.success("Marked as shipped");
                      })
                    }
                    className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
                  >
                    Mark as Shipped
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
