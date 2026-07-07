"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { brand } from "@/supermarket.config";

const Newsletter = () => {
  const POPUP_DELAY_MS = 10000;
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPopup]);

  const validateEmail = (value: string) =>
    String(value)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Welcome to Family House deals.");
        setEmail("");
        setShowPopup(false);
      } else {
        toast.error(data.error || "Subscription failed");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden bg-white py-10">
      <div className="max-w-360 mx-auto px-[5%] lg:px-[8%]">
        <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_18px_45px_rgba(215,25,32,0.08)]">
          <div className="relative flex flex-col gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <div className="max-w-2xl">
              <span className="text-xs font-black uppercase tracking-[0.28em] text-(--prim-color)">
                Family House Deals
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-black text-gray-950 Unbounded">
                Fresh offers for everyday essentials.
              </h2>
              <p className="mt-3 text-gray-600">
                Get grocery deals, bakery updates, chilled drink offers and household restock reminders.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full max-w-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-14 flex-1 rounded-xl border border-red-100 bg-white px-5 text-black outline-none focus:ring-2 focus:ring-(--prim-color)"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-14 rounded-xl bg-(--prim-color) px-8 font-black uppercase tracking-widest text-white hover:bg-(--prim-dark) disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Subscribe"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {showPopup && (
          <div
            className="fixed inset-0 z-1000 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          >
            <div
              className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-fadeIn md:grid-cols-[0.9fr_1.1fr]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                disabled={loading}
                className="absolute right-4 top-4 z-10 text-gray-400 transition hover:text-(--prim-color)"
                aria-label="Close newsletter popup"
              >
                <i className="bi bi-x-lg text-xl"></i>
              </button>

              <div className="hidden p-8 md:flex md:items-center md:justify-center">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={420}
                  height={420}
                  className="h-full max-h-96 w-full object-contain mb-15"
                />
              </div>

              <div className="p-8 md:p-10">
                <span className="text-xs font-black uppercase tracking-[0.28em] text-(--prim-color)">
                  Welcome offer
                </span>
                <h2 className="mt-3 text-3xl font-black text-black Unbounded">
                  Shop fresh. Save more.
                </h2>

                <p className="mt-4 text-lg font-semibold">
                  Enjoy <span className="text-(--prim-color)">30% off</span> your first Family House order.
                </p>

                <p className="mt-4 text-gray-600">
                  Subscribe for grocery deals, beverage promos, bakery drops and household essentials updates.
                </p>

                <form onSubmit={handleSubscribe} className="mt-6 space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none focus:ring-2 focus:ring-(--prim-color)"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-(--prim-color) py-4 font-black uppercase tracking-widest text-white transition hover:bg-(--prim-dark) disabled:opacity-70"
                  >
                    {loading ? "Sending..." : "Get 30% Off"}
                  </button>
                </form>

                <p className="mt-4 text-xs text-gray-400">
                  Offer valid for new subscribers only.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
