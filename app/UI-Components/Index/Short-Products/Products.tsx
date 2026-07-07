"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { sanityFetch, urlFor } from "@/app/lib/sanity";
import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/pagination";
import LoadingSpinner from "@/app/Components/LoadingSpinner";

type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

type Product = {
  _id: string;
  name: string;
  price: number;
  lessprice: number;
  slug: { current: string };
  review: number;
  image: SanityImage[];
};

export default function ShortProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShortProducts = async () => {
      try {
        const query = `*[_type == "product" && isShortProducts == true] | order(_createdAt desc)[0...40]{
            _id, name, price, "lessprice": lessPrice, slug, image, review
          }`;
        const data = await sanityFetch<Product[]>(query);
        setProducts(data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShortProducts();
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center font-bold">
        <LoadingSpinner />
      </div>
    );
  if (products.length === 0) return null;

  const chunkProducts = (arr: Product[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );

  const categories = [
    { title: "Featured Products", items: products.slice(0, 10) },
    { title: "Best Sellers", items: products.slice(10, 20) },
    { title: "New Arrivals", items: products.slice(20, 30) },
    { title: "Top Rated", items: products.slice(30, 40) },
  ];

  return (
    <section className="px-4 xl:px-[8%] py-12 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-100 rounded-4xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="short-product-title bg-(--prim-light) py-3 px-5 rounded-2xl mb-6">
              <h2 className="Unbounded text-[11px] font-bold text-slate-800 uppercase tracking-wider whitespace-nowrap text-center">
                {cat.title}
              </h2>
            </div>

            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              modules={[Autoplay, Pagination]}
              className="w-full h-full"
            >
              {chunkProducts(cat.items, 5).map((chunk, slideIdx) => (
                <SwiperSlide key={slideIdx}>
                  <div className="flex flex-col gap-6 ">
                    {chunk.map((product) => (
                      <Link
                        href={`/product/${product.slug.current}`}
                        key={product._id}
                        className="group flex items-start gap-4"
                      >
                        <div className="relative w-24 h-24 shrink-0 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                          <Image
                            src={urlFor(product.image[0]).url()}
                            alt={product.name}
                            fill
                            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-1 mb-1">
                            <i className="bi bi-star-fill text-(--prim-color) text-[10px]"></i>
                            <span className="text-[10px] font-bold text-slate-500">
                              4.8
                            </span>
                            <span className="text-[10px] text-slate-300">
                              ({product.review || 0})
                            </span>
                          </div>

                          <h3 className="text-[12px] text-slate-800 Unbounded leading-snug mb-1">
                            {product.name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-(--prim-color) font-bold text-[13px] Unbounded">
                              ₦{product.price.toLocaleString()}
                            </span>
                            {product.lessprice > 0 && (
                              <del className="text-slate-300 text-[10px] Unbounded decoration-slate-300">
                                ₦{product.lessprice.toLocaleString()}
                              </del>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    </section>
  );
}
