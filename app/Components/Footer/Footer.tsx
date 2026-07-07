"use client";

import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { brand, slugify, supermarketCategories } from "@/supermarket.config";

export default function Footer() {
  const year = new Date().getFullYear();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address)}`;

  return (
    <footer className="border-t border-red-100 bg-white">
      <div className="max-w-360 mx-auto px-[5%] lg:px-[8%] py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={96}
                height={76}
                className="h-16 w-auto rounded-md object-contain"
              />
              <span className="flex flex-col">
                <span className="text-medium font-black Unbounded uppercase">
                  Family House
                </span>
                <span className="text-xs font-black tracking-[0.28em] text-(--prim-color) uppercase">
                  Supermarket
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-6 text-gray-600">
              {brand.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={`https://wa.me/${brand.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#25D366]"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-6 w-6" />
              </a>
              <a
                href={brand.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-(--prim-color)"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href={brand.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-(--prim-color)"
                aria-label="TikTok"
              >
                <FaTiktok className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-black Unbounded uppercase tracking-widest">
              Shop
            </h2>
            <div className="grid gap-2">
              {supermarketCategories.slice(0, 6).map((category) => (
                <Link
                  key={category.title}
                  href={`/shop/${slugify(category.title)}`}
                  className="text-sm font-medium text-gray-600 hover:text-(--prim-color)"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-black Unbounded uppercase tracking-widest">
              Customer Care
            </h2>
            <div className="grid gap-2">
              <Link
                href="/cart"
                className="text-sm font-medium text-gray-600 hover:text-(--prim-color)"
              >
                Cart
              </Link>
              <Link
                href="/wishlist"
                className="text-sm font-medium text-gray-600 hover:text-(--prim-color)"
              >
                Wishlist
              </Link>
              <Link
                href="/track"
                className="text-sm font-medium text-gray-600 hover:text-(--prim-color)"
              >
                Track Order
              </Link>
              <Link
                href="/return-policy"
                className="text-sm font-medium text-gray-600 hover:text-(--prim-color)"
              >
                Return Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm font-medium text-gray-600 hover:text-(--prim-color)"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-black Unbounded uppercase tracking-widest">
              Visit Us
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 hover:text-(--prim-color)"
              >
                <i className="bi bi-geo-alt-fill text-(--prim-color)"></i>
                <span>{brand.address}</span>
              </a>
              <a
                href={`tel:${brand.phoneInternational}`}
                className="flex gap-3 hover:text-(--prim-color)"
              >
                <i className="bi bi-telephone-fill text-(--prim-color)"></i>
                <span>{brand.phone}</span>
              </a>
              <a
                href={`mailto:${brand.email}`}
                className="flex gap-3 hover:text-(--prim-color)"
              >
                <i className="bi bi-envelope-fill text-(--prim-color)"></i>
                <span>{brand.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-red-100 bg-gray-100 py-5 text-gray-700">
        <div className="max-w-360 mx-auto px-[5%] lg:px-[8%] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; {year} {brand.name}. All rights reserved.
          </p>
          <Link href="https://vertexvaulttech.vercel.app">
            <p className="text-xs font-bold  tracking-widest text-(--prim-color) cursor-pointer">
              Designed by Vertex vault Tech Company
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
