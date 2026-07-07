"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { client, urlFor } from "@/app/lib/sanity";
import LoadingSpinner from "@/app/Components/LoadingSpinner";
import "swiper/css";
import "swiper/css/pagination";

type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type HeroData = {
  _id: string;
  name: string;
  small_text: string;
  description?: string;
  slug: {
    current: string;
  };
  image: SanityImage[];
};

export default function Hero() {
  const [heroProducts, setHeroProducts] = useState<HeroData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const query = `
          *[
            _type == "product" &&
            isHero == true
          ]
          | order(Hero_order asc)[0...4]{
            _id,
            name,
            slug,
            image,
            small_text,
            description
          }
        `;

        const data: HeroData[] = await client.fetch(query);

        setHeroProducts(data || []);
      } catch (error) {
        console.error("Hero Fetch Error:", error);
        setHeroProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!heroProducts.length) {
    return null;
  }

  return (
    <section className="w-full bg-[#f5f5f5] px-[4%] py-2 lg:px-[8%] lg:py-3">
      <div className="mx-auto max-w-450">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          pagination={{ clickable: true,}}
          autoplay={{ delay: 3000, disableOnInteraction: false,}}
          spaceBetween={30}
          centeredSlides={true}
          className="hero-swiper overflow-hidden rounded-xl"
        >
          {heroProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <Link href={`/product/${product.slug.current}`}>
                <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 h-full flex flex-col lg:flex-row items-center bg-white">
                 {/* Left Side: Content */}
                  <div className="w-full lg:w-1/2 p-8 z-10 h-full flex justify-center items-start flex-col lg:pl-14">
                    <h1 className="Merienda text-3xl lg:text-[3.6rem] font-bold leading-tight">
                      {product.name.split(" ").slice(0, 1).join(" ")}{" "}
                      <span className="bg-red-600 px-4 py-1 rounded-2xl text-white inline-block">
                        {product.name.split(" ").slice(1, 2).join(" ")}
                      </span>{" "}
                      {product.name.split(" ").slice(2).join(" ")}
                    </h1>

                    <p className="w-[90%] my-5 text-gray-700 font-medium">
                     {product.small_text}
                    </p>

                    <button className="px-6 py-3 rounded-full text-white font-bold bg-red-600 hover:bg-white hover:text-red-600 border border-red-600 transition-all duration-300 shadow-lg">
                      Shop Now <i className="bi bi-cart3 ps-2"></i>
                    </button>
                  </div>
                    {/* Right Side: Image */}
                  <div className="w-full lg:w-1/2 h-full flex justify-center items-center p-8">
                    <Image
                      src={urlFor(product.image[0]).url()}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="object-contain w-full h-full max-h-96 lg:max-h-full"
                    />
                  </div>                
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* SWIPER PAGINATION */}
      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 12px !important;
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 11px;
          height: 11px;
          background: #fca5a5;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          width: 34px;
          border-radius: 999px;
          background: #dc2626;
        }
      `}</style>
    </section>
  );
}
