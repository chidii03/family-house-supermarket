"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sanityFetch, urlFor } from "@/app/lib/sanity";
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
  soldCurrent: number;
  soldTotal: number;
  image: SanityImage[];
  sale: string;
  isHotDeal: boolean;
  HotDealOrder?: number;
};

type CartItem = Product & { qty: number };

export default function HotDeals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        const query = `*[_type == "product" && isHotDeal == true && isBestSales != true && isbanner != true] | order(HotDealOrder asc, _createdAt desc)[0...40]{
          _id, name, price, lessprice, slug, image, review, sale, soldCurrent, soldTotal, HotDealOrder
        }`;
        const data = await sanityFetch<Product[]>(query);
        setProducts(data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHotDeals();
  }, []);

  const handleAddToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      toast.error(`${product.name} is already in the cart!`);
    } else {
      cart.push({ ...product, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storageUpdate"));
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleAddToWishlist = (product: Product) => {
    const wishlist: Product[] = JSON.parse(
      localStorage.getItem("wishlist") || "[]",
    );
    const isFavourite = wishlist.find((item) => item._id === product._id);
    if (isFavourite) {
      toast(`${product.name} is already in wishlist!`);
    } else {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("storageUpdate"));
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center font-bold">
        <LoadingSpinner />
      </div>
    );
  if (products.length === 0) return null;

  const featuredProduct = products[0];
  const sliderProducts = products.slice(1);

  return (
    <section className="py-12 bg-[#F9FAFB] overflow-hidden">
      <div className="px-[5%] lg:px-[8%]">
        {/* --- HEADER --- */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="flex items-center gap-2 text-(--prim-color) font-bold uppercase tracking-tighter text-sm mb-2">
              <i className="bi bi-fire text-xl"></i> Limited Time Offers
            </span>
            <h2 className="text-xl lg:text-xl font-black whitespace-nowrap text-slate-900 Unbounded">
              Hot <span className="text-(--prim-color)">Deals</span> Today
            </h2>
          </div>
          <Link
            href="/ShopAll"
            className="text-(--prim-color) font-bold hover:gap-3 transition-all flex items-center gap-2"
          >
            View All <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {/* --- MAIN BANNER (WRAPPED WITH LINK OVERLAY) --- */}
        <div className="group relative overflow-hidden rounded-4xl bg-white border border-gray-100 mb-16 shadow-2xl shadow-blue-100/50 transition-all duration-300 hover:shadow-blue-200/60">
          {/* Invisible Overlay Link for the whole container */}
          <Link
            href={`/product/${featuredProduct.slug.current}`}
            className="absolute inset-0 z-10"
            aria-label={`View ${featuredProduct.name}`}
          />

          <div className="flex flex-col lg:flex-row items-center relative">
            <div className="w-full lg:w-1/2 p-10 lg:p-20 relative z-20 pointer-events-none">
              {/* pointer-events-none ensures the link underneath is clickable, 
                  pointer-events-auto is used on specific buttons below */}

              <div className="flex gap-3 mb-6">
                <span className="px-4 py-1 rounded-full bg-(--prim-color) text-white text-[10px] font-black uppercase tracking-widest">
                  Flash Sale
                </span>
                <span className="px-4 py-1 rounded-full bg-blue-50 text-(--prim-color) text-[10px] font-black uppercase">
                  Official Store
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-none Unbounded uppercase">
                Premium <br />
                <span className="text-(--prim-color) italic font-serif">
                  Executive
                </span>{" "}
                <br />
                Choice
              </h2>

              <p className="text-slate-500 text-lg mb-10 max-w-sm leading-relaxed">
                Elevate your space with our top-tier {featuredProduct.name}.
              </p>

              {/* --- PRICE SECTION --- */}
              <div className="flex items-center gap-3 mb-8 md:mb-10">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                    Current Price
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-black leading-none">
                    ₦{featuredProduct.price?.toLocaleString()}
                  </span>
                </div>

                {featuredProduct.lessprice && (
                  <>
                    <div className="w-[1.5px] h-10 bg-gray-200 mx-2 self-end mb-1"></div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                        Original
                      </span>
                      <span className="text-xl md:text-2xl line-through text-gray-400 font-bold leading-none">
                        ₦{featuredProduct.lessprice.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* --- ACTION BUTTONS --- */}
              <div className="flex gap-4 pointer-events-auto relative z-30">
                {/* We use pointer-events-auto so the buttons can be clicked independently of the overlay link */}
                <button className="flex-1 lg:flex-none px-12 py-4 rounded-2xl text-white font-bold bg-slate-900 hover:bg-(--prim-color) transition-all duration-300 shadow-xl flex items-center justify-center gap-3">
                  Shop <i className="bi bi-bag-check-fill text-xl"></i>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault(); // Stop navigation from overlay link
                    e.stopPropagation(); // Stop click from reaching parent link
                    handleAddToWishlist(featuredProduct);
                  }}
                  className="group/heart p-4 rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-(--prim-color) transition-all duration-300 shadow-sm"
                >
                  <i className="bi bi-balloon-heart text-2xl group-hover/heart:scale-110"></i>
                </button>
              </div>
            </div>

            {/* --- IMAGE SECTION --- */}
            <div className="w-full lg:w-1/2 h-100 lg:h-150 relative bg-white z-0">
              <Image
                src={urlFor(featuredProduct.image[0]).url()}
                alt={featuredProduct.name}
                className="object-contain p-12 group-hover:scale-105 transition-transform duration-700"
                fill
                priority
              />
            </div>
          </div>
        </div>

        {/* --- PRODUCT SLIDER --- */}
        <div className="w-full relative group/arrows">
          {/* Navigation Arrows */}
          <button className="best-prev absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-(--prim-color) flex items-center justify-center shadow-xl hover:scale-110 transition-all active:scale-95 disabled:opacity-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="best-next absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-(--prim-color) flex items-center justify-center shadow-xl hover:scale-110 transition-all active:scale-95 disabled:opacity-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6L15 12L9 18"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {sliderProducts.length > 0 ? (
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                prevEl: ".best-prev",
                nextEl: ".best-next",
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={sliderProducts.length > 4}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-28 px-2 best-hotdeals-swiper"
            >
              {sliderProducts.map((product) => (
                <SwiperSlide key={product._id} className="h-auto">
                  {/* MAIN CONTAINER DIV */}
                  <div className="group/card bg-white rounded-3xl border border-slate-100 p-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative h-full flex flex-col overflow-hidden">
                    {/* 1. OVERLAY LINK: Makes the whole card clickable */}
                    <Link
                      href={`/product/${product.slug.current}`}
                      className="absolute inset-0 z-10"
                      aria-label={`View ${product.name}`}
                    />

                    {/* 2. TOP BADGES & WISHLIST (z-20 to stay above link) */}
                    <div className="flex justify-between items-start mb-4 relative z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToWishlist(product);
                        }}
                        className="w-10 h-10 rounded-full bg-blue-50 text-(--prim-color) flex items-center justify-center hover:bg-(--prim-color) hover:text-white transition-all"
                      >
                        <i className="bi bi-balloon-heart text-lg"></i>
                      </button>
                      <div className="bg-(--prim-color) text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-blue-100">
                        HOT DEAL
                      </div>
                    </div>

                    {/* 3. IMAGE SECTION (pointer-events-none so link works) */}
                    <div className="relative h-48 w-full mb-6 block overflow-hidden rounded-xl pointer-events-none">
                      <Image
                        src={urlFor(product.image[0]).url()}
                        alt={product.name}
                        fill
                        className="object-contain p-6 group-hover/card:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* 4. CONTENT SECTION */}
                    <div className="flex flex-col grow relative z-20 pointer-events-none">
                      <h3 className="font-bold text-slate-800 text-md mb-2 line-clamp-1">
                        {product.name}
                      </h3>

                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase">
                          <span>Sold: {product.soldCurrent || 0}</span>
                          <span>Stock: {product.soldTotal || 50}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-(--prim-color) to-blue-300 rounded-full"
                            style={{
                              width: `${((product.soldCurrent || 0) / (product.soldTotal || 50)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* 5. BOTTOM SECTION (Re-enable pointer-events for Cart Button) */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 pointer-events-auto">
                        <div>
                          <p className="text-slate-900 font-black text-lg">
                            ₦{product.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-300 line-through">
                            ₦
                            {(
                              product.lessprice || product.price + 2000
                            ).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="h-12 w-12 rounded-xl bg-(--prim-color) text-white flex items-center justify-center hover:bg-(--prim-dark) transition-all shadow-lg"
                        >
                          <i className="bi bi-cart3 text-xl"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
              More hot deals are being added right now!
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .best-hotdeals-swiper .swiper-pagination {
          position: relative;
          margin-top: 16px;
        }

        .best-hotdeals-swiper .swiper-pagination-bullet {
          background: #d1d5db !important;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .best-hotdeals-swiper .swiper-pagination-bullet-active {
          background: red !important;
          width: 24px;
          border-radius: 5px;
        }

        .swiper-button-disabled {
          display: none !important;
        }
      `}</style>
    </section>
  );
}
