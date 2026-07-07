"use client";
import { useState } from "react";
import { fetchTrackingInfo, OrderResponse } from "@/app/lib/api";
import { Package, Truck, CheckCircle, Loader, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function TrackOrder() {
  const [id,      setId]      = useState("");
  const [data,    setData]    = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleTrack = async () => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    setTimeout(async () => {
      const result = await fetchTrackingInfo(id.trim());
      if (!result) setError("Order not found. Check your tracking ID and try again.");
      setData(result);
      setLoading(false);
    }, 800);
  };

  const getStep = (status: string) => {
    if (status === "DELIVERED") return 4;
    if (status === "SHIPPED")   return 3;
    if (status === "PAID")      return 2;
    return 1;
  };

  const steps: { icon: LucideIcon; label: string }[] = [
    { icon: Loader,       label: "Pending"   },
    { icon: CheckCircle,  label: "Paid"      },
    { icon: Truck,        label: "Shipped"   },
    { icon: Package,      label: "Delivered" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="Unbounded text-3xl md:text-5xl font-black mb-3">Track Order</h1>
        <p className="text-gray-500 text-sm">Real-time package status updates</p>
      </div>

      <div className="w-full max-w-xl mb-10">

        {/* Mobile layout: stacked */}
        <div className="flex flex-col gap-3 sm:hidden">
          <div className="bg-white rounded-2xl shadow border border-gray-100 flex items-center px-4 py-1">
            <Search size={16} className="text-gray-400 mr-3 shrink-0" />
            <input
              value={id}
              onChange={e => setId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleTrack()}
              placeholder="Tracking ID (e.g., ORD-8291)"
              className="flex-1 min-w-0 outline-none text-base font-medium uppercase placeholder:normal-case placeholder:font-normal py-3"
            />
          </div>
          <button
            onClick={handleTrack}
            disabled={loading}
            className="w-full bg-(--prim-color) text-white py-4 rounded-2xl font-bold text-sm hover:bg-(--prim-dark) active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Locating…" : "Track Package"}
          </button>
        </div>

        {/* Tablet / Desktop layout: pill with inline button */}
        <div className="hidden sm:flex bg-white pl-6 pr-2 py-2 rounded-full shadow-lg border border-gray-100 items-center gap-2">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            value={id}
            onChange={e => setId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleTrack()}
            placeholder="Tracking ID (e.g., ORD-8291)"
            className="flex-1 min-w-0 outline-none text-base font-medium uppercase placeholder:normal-case placeholder:font-normal"
          />
          <button
            onClick={handleTrack}
            disabled={loading}
            /* min-w ensures button never collapses on medium screens */
            className="shrink-0 min-w-27.5 bg-(--prim-color) text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-(--prim-dark) active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Locating…" : "Track"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && !data && (
        <div className="w-full max-w-xl bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-sm font-semibold text-center mb-6">
          {error}
        </div>
      )}

      {/* Result card */}
      {data && (
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-4 duration-500">

          {/* Status header */}
          <div className="bg-(--prim-color,#4b70f5) p-6 text-white flex justify-between items-center gap-4">
            <div>
              <p className="text-xs opacity-80 uppercase tracking-widest mb-1">Status</p>
              <h2 className="text-2xl font-bold Unbounded">{data.status}</h2>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs opacity-80 uppercase tracking-widest mb-1">Amount</p>
              <p className="text-xl font-bold">
                ₦{(data.total_amount ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Timeline */}
            <div className="relative flex justify-between mb-8">
              {/* Background track */}
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-10" />
              {/* Progress fill */}
              <div
                className="absolute top-5 left-0 h-1 bg-(--prim-color,#4b70f5) -z-10 transition-all duration-1000"
                style={{ width: `${((getStep(data.status) - 1) / 3) * 100}%` }}
              />

              {steps.map((step, i) => {
                const active = i + 1 <= getStep(data.status);
                return (
                  <div key={i} className="flex flex-col items-center bg-white px-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      active
                        ? "border-(--prim-color,#4b70f5) bg-(--prim-color,#4b70f5) text-white"
                        : "border-gray-200 text-gray-300"
                    }`}>
                      <step.icon size={18} />
                    </div>
                    <span className={`text-[10px] sm:text-xs mt-2 font-bold text-center leading-tight ${
                      active ? "text-black" : "text-gray-300"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between border-b pb-3 border-gray-200 gap-4">
                <span className="text-gray-500 text-sm shrink-0">Customer</span>
                <span className="font-semibold text-sm text-right">{data.customer_name}</span>
              </div>
              <div className="flex justify-between border-b pb-3 border-gray-200 gap-4">
                <span className="text-gray-500 text-sm shrink-0">Order ID</span>
                <span className="font-semibold text-sm text-right text-(--prim-color,#4b70f5)">{data.order_id}</span>
              </div>
              <div className="flex justify-between border-b pb-3 border-gray-200 gap-4">
                <span className="text-gray-500 text-sm shrink-0">Date</span>
                <span className="font-semibold text-sm">
                  {data.created_at ? new Date(data.created_at).toLocaleDateString("en-NG") : "—"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 text-sm shrink-0">Delivery To</span>
                <span className="font-semibold text-sm text-right">{data.address}, {data.state}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
