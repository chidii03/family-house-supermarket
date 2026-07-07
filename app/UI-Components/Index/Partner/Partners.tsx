"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Clock3,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBasket,
} from "lucide-react";

export default function Partners() {
  const promises = [
    { title: "Fresh Aisles", text: "Food condiments, provisions and bakery treats.", icon: ShoppingBasket },
    { title: "Quality Checked", text: "Carefully selected everyday essentials.", icon: BadgeCheck },
    { title: "Cold Room Picks", text: "Frozen foods, drinks, yoghurt and ice cream.", icon: PackageCheck },
    { title: "Ikotun Pickup", text: "Visit us at Governor's Road, Lagos.", icon: MapPin },
    { title: "Friendly Support", text: "WhatsApp and phone support for your orders.", icon: Clock3 },
    { title: "Secure Checkout", text: "Simple cart, checkout and Paystack payments.", icon: ShieldCheck },
  ];

  const extendedPromises = [...promises, ...promises];

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold Unbounded text-gray-900">
            Your Neighbourhood Supermarket
          </h2>
          <p className="text-gray-600 mt-2">
            Quality products, great prices and a welcoming shopping experience.
          </p>
        </div>

        <div className="relative h-28 w-full overflow-hidden">
          <motion.div
            className="flex absolute left-0 gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            style={{ width: "200%" }}
          >
            {extendedPromises.map((item, index) => {
              const Icon = item.icon;
              return (
              <div
                key={`${item.title}-${index}`}
                className="shrink-0 w-72 rounded-2xl border border-red-100 bg-white p-5 flex items-start gap-4"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-(--prim-color)">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-black uppercase tracking-wide text-black">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-600">
                    {item.text}
                  </p>
                </div>
              </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
