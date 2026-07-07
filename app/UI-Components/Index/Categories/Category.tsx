"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { slugify, supermarketCategories } from "@/supermarket.config";

export default function Category() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-360 mx-auto px-[5%] lg:px-[8%]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.28em] text-(--prim-color)">
              Shop the aisles
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-black tracking-tight">
              Browse by Category
            </h2>
          </div>
          <Link href="/ShopAll" className="hidden sm:inline-flex rounded-lg bg-(--prim-color) px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-(--prim-dark)">
            View All
          </Link>
        </div>

        <Swiper
          slidesPerView={2}
          spaceBetween={14}
          loop
          modules={[Autoplay]}
          autoplay={{ delay: 2600, disableOnInteraction: false }}
          breakpoints={{
            1200: { slidesPerView: 5 },
            900: { slidesPerView: 4 },
            640: { slidesPerView: 3 },
          }}
        >
          {supermarketCategories.map((category) => (
            <SwiperSlide key={category.title}>
              <Link
                href={`/shop/${slugify(category.title)}`}
                className="group block h-full rounded-lg border border-red-100 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(215,25,32,0.1)]"
              >
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-2xl text-(--prim-color)">
                  <i className={`bi ${category.icon}`}></i>
                </div>
                <h3 className="min-h-12 text-sm md:text-base font-black uppercase leading-tight text-gray-950">
                  {category.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-xs font-medium text-gray-500">
                  {category.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-(--prim-color)">
                  Explore <i className="bi bi-arrow-right transition-transform group-hover:translate-x-1"></i>
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
