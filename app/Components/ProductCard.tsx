"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/app/lib/sanity";

type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

interface ProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    lessprice?: number;
    slug: { current: string };
    image: SanityImage[];
  };
}

export default function ProductCard({ product }: ProductProps) {
  const discount = product.lessprice
    ? Math.round(((product.lessprice - product.price) / product.lessprice) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.slug.current}`}
      className="group block h-full rounded-lg border border-red-100 bg-white p-2 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(215,25,32,0.1)]"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-red-50/60">
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-(--prim-color) px-2 py-1 text-[10px] font-black text-white">
            -{discount}%
          </span>
        )}

        {product.image?.[0] ? (
          <Image
            src={urlFor(product.image[0]).url()}
            alt={product.name}
            fill
            className="object-contain p-5 transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-bold text-gray-400">
            No Image
          </div>
        )}

        <div className="absolute inset-0 flex items-end justify-center bg-black/5 pb-4 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="translate-y-4 rounded-md bg-white/90 px-4 py-2 text-(--prim-color) shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
            <i className="bi bi-basket2-fill text-lg"></i>
          </span>
        </div>
      </div>

      <div className="px-1 pb-2 pt-3">
        <h3 className="min-h-9 text-[11px] md:text-[13px] font-bold text-gray-950 uppercase line-clamp-2 tracking-tight">
          {product.name}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-[14px] md:text-[16px] font-black text-(--prim-color)">
            ₦{product.price.toLocaleString()}
          </span>
          {product.lessprice && (
            <span className="text-[10px] md:text-[12px] font-bold text-gray-400 line-through">
              ₦{product.lessprice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
