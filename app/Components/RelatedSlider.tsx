"use client";

import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/app/lib/sanity";


interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  slug: { current: string };
  image: SanityImage[];
}

interface Props {
  title: string;
  products: Product[];
}

export default function RelatedSlider({ title, products }: Props) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  if (!products || products.length === 0) return null;

  return (
    <div className="relative group bg-white p-4 lg:p-6 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          {/* Custom Navigation Buttons */}
          <button
            className={`prev-${id} w-8 h-8 flex items-center justify-center rounded-full border border-red-100 text-(--prim-color) hover:bg-red-50 disabled:opacity-30 transition-all cursor-pointer`}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            className={`next-${id} w-8 h-8 flex items-center justify-center rounded-full border border-red-100 text-(--prim-color) hover:bg-red-50 disabled:opacity-30 transition-all cursor-pointer`}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={2}
        navigation={{
          nextEl: `.next-${id}`,
          prevEl: `.prev-${id}`,
        }}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
        className="w-full"
      >
        {products.map((item) => (
          <SwiperSlide key={item._id}>
            <Link
              href={`/product/${item.slug.current}`}
              className="group block h-full"
            >
              <div className="relative aspect-square mb-2 bg-gray-50 rounded-md overflow-hidden">
                <Image
                  src={urlFor(item.image[0]).url()}
                  alt={item.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs Unbounded lg:text-sm text-gray-900 font-medium line-clamp-2 h-10 group-hover:underline group-hover:text-(--prim-color)">
                {item.name}
              </h3>

              <div className="mt-1">
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex text-(--prim-color) text-[10px]">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill"></i>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">(45)</span>
                </div>
                <div className="text-sm font-bold text-black Unbounded">
                  ₦{item.price.toLocaleString()}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
