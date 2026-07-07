"use client";

import Link from "next/link";
import { brand } from "@/supermarket.config";

export default function WhatsAppFloat() {
  const message = `Hello ${brand.name}, I would like to make an inquiry.`;
  const whatsappLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-9999 group xl:hidden ">
      <Link
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-bounce-slow"
        aria-label="Chat on WhatsApp"
      >
        <i className="bi bi-whatsapp text-3xl"></i>
      </Link>

      <span className="absolute inset-0 rounded-full bg-green-500 -z-10 animate-ping opacity-20"></span>
    </div>
  );
}
