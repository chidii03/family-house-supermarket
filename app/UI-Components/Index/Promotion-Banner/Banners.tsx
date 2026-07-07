"use client";

import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/app/lib/sanity";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/app/Components/LoadingSpinner";

type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

type bannerData = {
  _id: string;
  name: string;
  banner_text: string;
  description?: string;
  slug: { current: string };
  image: SanityImage[];
};

export default function Banners() {
  const [bannerProducts, setBannerProducts] = useState<bannerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const query = `*[_type == "product" && ispromo_banner == true && isBestOffer != true && isTopSelling != true  && isHotDeal != true && isBestSales != true && isbanner != true && isShortProducts != true && isArrivals != true && isHero != true] | order(promobanner_order asc)[0...3]{
          _id, 
          name, 
          banner_text, 
          description, 
          slug, 
          image
        }`;
        const data = await client.fetch(query);
        setBannerProducts(data);
      } catch {
        setBannerProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center">
        <LoadingSpinner />
      </div>
    );

  if (bannerProducts.length === 0) return null;
  const [mainBanner, secondBanner, thirdBanner] = bannerProducts;

  return (
    <section className="overflow-hidden py-10 bg-white">
      <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* --- BANNER 1: Large Main Banner (Dynamic) --- */}
        {mainBanner && (
          <div className="relative z-1 overflow-hidden rounded-2xl bg-white border border-red-100 mb-8 shadow-[0_18px_45px_rgba(215,25,32,0.08)]">
            <Link href={`/product/${mainBanner.slug.current}`}>
              <div className="flex flex-col lg:flex-row items-center">
                <div className="w-full lg:w-1/2 p-8 lg:p-16">
                  <span className="block text-sm font-black uppercase tracking-widest text-(--prim-color) mb-3">
                    {mainBanner.banner_text}
                  </span>
                  <h2 className="font-sans font-black text-3xl lg:text-5xl text-dark uppercase leading-tight">
                    {mainBanner.name.split(" ").slice(0, 3).join(" ")}{" "}
                  </h2>
                  <span className="text-(--prim-color) font-sans font-black text-3xl lg:text-5xl text-dark mb-2 uppercase leading-tight">
                    {mainBanner.name.split(" ").slice(7, 10).join(" ")}
                  </span>{" "}
                  <p className="text-gray-600 text-base mb-8 max-w-95 line-clamp-2">
                    {mainBanner.description}
                  </p>
                  <button className="px-8 py-3.5 rounded-2xl text-white font-bold bg-(--prim-color) hover:bg-(--prim-dark) border border-(--prim-color) transition-all duration-300 shadow-lg flex items-center gap-2 cursor-pointer">
                    Shop Now <i className="bi bi-arrow-right ps-2"></i>
                  </button>
                </div>
                <div className="w-full lg:w-1/2 h-75 lg:h-112.5 relative">
                  <Image
                    src={urlFor(mainBanner.image[0]).url()}
                    alt={mainBanner.name}
                    className="object-contain p-6 lg:p-10"
                    fill
                    priority
                  />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* --- GRID FOR SMALL BANNERS --- */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* --- BANNER 2: Blue Themed (Dynamic) --- */}
          {secondBanner && (
            <div className="relative overflow-hidden rounded-2xl bg-white flex flex-col h-full border border-red-100 shadow-[0_18px_45px_rgba(215,25,32,0.08)]">
              <Link href={`/product/${secondBanner.slug.current}`}>
                <div className="p-8 lg:p-12 z-10">
                  <span className="block text-sm font-black uppercase tracking-widest text-(--prim-color) mb-2">
                    {secondBanner.banner_text}
                  </span>
                  <h2 className="Unbounded font-black text-3xl lg:text-5xl uppercase">
                    {secondBanner.name.split(" ").slice(0, 2).join(" ")}{" "}
                  </h2>
                  <span className="text-(--prim-color) font-sans font-black text-3xl lg:text-5xl text-dark mb-2 uppercase leading-tight">
                    {secondBanner.name.split(" ").slice(6, 8).join(" ")}
                  </span>{" "}
                  <p className="text-gray-600 mb-6 font-medium max-w-65 line-clamp-2">
                    {secondBanner.description}
                  </p>
                  <button className="px-8 py-3 rounded-lg text-white font-bold bg-(--prim-color) hover:bg-(--prim-dark) transition-all duration-300 shadow-md cursor-pointer">
                    Shop Now
                  </button>
                </div>
                <div className="relative h-70 w-full mt-auto">
                  <Image
                    src={urlFor(secondBanner.image[0]).url()}
                    alt={secondBanner.name}
                    className="object-contain p-4"
                    fill
                  />
                </div>
              </Link>
            </div>
          )}

          {/* --- BANNER 3: Amber Themed (Dynamic) --- */}
          {thirdBanner && (
            <div className="relative overflow-hidden rounded-2xl bg-white flex flex-col h-full border border-red-100 shadow-[0_18px_45px_rgba(215,25,32,0.08)]">
              <Link href={`/product/${thirdBanner.slug.current}`}>
                <div className="p-8 lg:p-12 z-10">
                  <span className="block text-sm font-black uppercase tracking-widest text-(--prim-color) mb-2">
                    {thirdBanner.banner_text}
                  </span>
                  <h2 className="font-sans font-black text-3xl lg:text-5xl text-dark uppercase leading-tight">
                    {thirdBanner.name.split(" ").slice(4, 6).join(" ")}{" "}
                  </h2>
                  <span className=" font-sans font-black text-3xl lg:text-5xl text-dark text-(--prim-color) mb-2 uppercase leading-tight">
                    {thirdBanner.name.split(" ").slice(6, 8).join(" ")}
                  </span>{" "}
                  <p className="text-gray-600 mb-6 font-medium max-w-65 line-clamp-2">
                    {thirdBanner.description}
                  </p>
                  <button className="px-8 py-3 rounded-lg text-white font-bold bg-(--prim-color) hover:bg-(--prim-dark) transition-all duration-300 shadow-md cursor-pointer">
                    Buy Now
                  </button>
                </div>
                <div className="relative h-70 w-full mt-auto">
                  <Image
                    src={urlFor(thirdBanner.image[0]).url()}
                    alt={thirdBanner.name}
                    className="object-contain p-4"
                    fill
                  />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
