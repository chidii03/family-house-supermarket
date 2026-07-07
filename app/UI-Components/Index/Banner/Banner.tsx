"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/app/lib/sanity";
import LoadingSpinner from "@/app/Components/LoadingSpinner";

// --- TYPES ---
type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

type BannerData = {
  _id: string;
  name: string;
  price: number;
  lessprice?: number;
  slug: { current: string };
  image: SanityImage[];
  sale: string;
  soldCurrent: number;
  soldTotal: number;
};

export default function Banner() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const query = `*[_type == "product" && slug.current == "dish-plate-with-cover"][0]{
          name, image, price, lessprice, slug
        }`;
        const data = await client.fetch(query);
        if (isMounted) setBanner(data);
      } catch {
        if (isMounted) setBanner(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center">
        <LoadingSpinner />
      </div>
    );

  if (!banner) return null;

  const bannerImageUrl = banner.image?.[0] ? urlFor(banner.image[0]).url() : "";

  return (
    <section className="px-[5%] lg:px-[12%] py-6">
      <Link href={`/product/${banner.slug.current}`} className="block group">
        <div className="relative overflow-hidden rounded-2xl bg-white flex flex-row items-center justify-between min-h-70 md:h-87.5 border border-red-100 transition-shadow hover:shadow-[0_18px_45px_rgba(215,25,32,0.08)]">
          {/* Left Side: Content */}
          <div className="w-[60%] md:w-3/5 p-6 md:p-16 flex flex-col items-start z-10 text-left">
            <span className="inline-block px-3 py-1 mb-3 text-[9px] md:text-[10px] font-bold tracking-widest uppercase rounded-full bg-red-50 text-[#d71920]">
              Family house deal
            </span>

            <h2 className="text-xl md:text-4xl font-black text-slate-900 leading-tight mb-3 uppercase tracking-tighter Merienda">
              {banner.name}
            </h2>

            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <span className="text-2xl md:text-3xl font-bold text-[#d71920] Unbounded">
                ₦{banner.price?.toLocaleString()}
              </span>
            </div>

            {/* Styled as a button, but technically a div/span to keep HTML valid */}
            <div className="bg-(--prim-color) text-white text-[10px] md:text-[12px] px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold group-hover:bg-(--prim-dark) transition-all flex items-center gap-2 shadow-md uppercase">
              Shop Now <i className="bi bi-cart"></i>
            </div>
          </div>

          {/* Right Side: Product Image */}
          <div className="w-[40%] md:w-2/5 h-full relative flex items-center justify-center p-4 md:p-8">
            <div className="absolute w-32 h-32 md:w-64 md:h-64 bg-red-100/70 rounded-full blur-3xl z-0"></div>

            {bannerImageUrl && (
              <div className="relative w-full h-65 md:h-full transition-transform duration-500 group-hover:scale-110">
                <Image
                  src={bannerImageUrl}
                  alt={banner.name}
                  fill
                  className="object-contain drop-shadow-2xl z-10"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </Link>
    </section>
  );
}
