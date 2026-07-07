"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Heart, ShoppingCart } from "lucide-react";

// --- SWIPER STYLES ---
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { sanityFetch, urlFor } from "@/app/lib/sanity";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/app/Components/LoadingSpinner";

// --- TYPES ---
type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

type Product = {
  _id: string;
  name: string;
  price: number;
  lessprice?: number;
  slug: { current: string };
  image: SanityImage[];
  sale: string;
  soldCurrent: number;
  soldTotal: number;
  BestSales?: number;
};

type CartItem = Product & { qty: number };

export default function BestSales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBestSales() {
      try {
        const query = `*[_type == "product" && isBestSales == true && isArrivals != true] | order(BestSales asc, _createdAt desc)[0...40]{
          _id, name, price, lessprice, slug, image, review, sale, soldCurrent, soldTotal, HotDealOrder
        }`;
        const data = await sanityFetch<Product[]>(query);
        setProducts(data || []);
    } catch {
      setProducts([]);
    } finally {
        setLoading(false);
      }
    }
    getBestSales();
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
      localStorage.getItem("wishlist") || "[]"
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
  const sliderItems = products.slice(1);

  return (
    <section className="py-8 md:py-12 px-[5%] lg:px-[8%] bg-white relative">
   {/* --- SECTION HEADER --- */}
<div className="flex items-center gap-6 mb-10">
  <div className="flex items-center gap-3">
    <div className="flex flex-col">
      <h2 className="text-2xl md:text-3xl font-black text-black tracking-tighter uppercase leading-none">
        Live Deals
      </h2>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
        Timed Offers
      </span>
    </div>
  </div>
  <div className="h-[1.5px] flex-1 bg-gray-100"></div>
</div>

{/* --- FEATURED BANNER --- */}
<div className="group/banner mb-16 relative overflow-hidden rounded-4xl bg-white border border-gray-100 shadow-2xl shadow-blue-100/50 transition-all duration-300">
  
  {/* 1. OVERLAY LINK FOR BANNER */}
  <Link 
    href={`/product/${featuredProduct.slug.current}`} 
    className="absolute inset-0 z-10"
    aria-label={featuredProduct.name}
  />

  <div className="flex flex-col lg:flex-row items-center relative">
    {/* Text Content */}
    <div className="w-full lg:w-1/2 p-10 lg:p-20 relative z-20 pointer-events-none">
      <div className="flex gap-3 mb-6">
        <span className="px-4 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest">
          Flash Sale
        </span>
        <span className="px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase">
          Best Seller
        </span>
      </div>

      <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-none uppercase tracking-tighter">
        Featured <br />
        <span className="text-blue-600 italic font-serif">Selection</span> <br />
        Today
      </h2>

      <p className="text-slate-500 text-lg mb-10 max-w-sm leading-relaxed">
        Don&apos;t miss out on our top-rated {featuredProduct.name} at an unbeatable price.
      </p>

      {/* Price Section */}
      <div className="flex items-center gap-3 mb-8 md:mb-10">
        <div className="flex flex-col">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Current Price</span>
          <span className="text-2xl md:text-3xl font-black text-black leading-none">
            ₦{featuredProduct.price?.toLocaleString()}
          </span>
        </div>
        {featuredProduct.lessprice && (
          <>
            <div className="w-[1.5px] h-10 bg-gray-200 mx-2 self-end mb-1"></div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Original</span>
              <span className="text-xl md:text-2xl line-through text-gray-400 font-bold leading-none">
                ₦{featuredProduct.lessprice.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Buttons (pointer-events-auto to make them clickable) */}
      <div className="flex gap-4 pointer-events-auto">
        <button className="flex-1 lg:flex-none px-12 py-4 rounded-2xl text-white font-bold bg-slate-900 hover:bg-blue-600 transition-all duration-300 shadow-xl flex items-center justify-center gap-3">
          Buy <ShoppingCart size={20} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToWishlist(featuredProduct);
          }}
          className="p-4 rounded-2xl border border-slate-200 bg-white text-black transition-all duration-300 shadow-sm hover:text-red-500"
        >
          <Heart size={24} />
        </button>
      </div>
    </div>

    {/* Image Content */}
    <div className="w-full lg:w-1/2 h-75 lg:h-125 relative bg-white z-0">
      <Image
        src={urlFor(featuredProduct.image[0]).url()}
        alt={featuredProduct.name}
        className="object-contain p-8 lg:p-12 transition-transform duration-700 group-hover/banner:scale-105"
        fill
        priority
      />
    </div>
  </div>
</div>

{/* --- SLIDER WRAPPER --- */}
<div className="relative group/arrows">
  {/* Navigation Arrows (Keeping your original buttons) */}
  <button className="best-prev absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-xl hover:scale-110 transition-all active:scale-95 disabled:opacity-0">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </button>
  <button className="best-next absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-xl hover:scale-110 transition-all active:scale-95 disabled:opacity-0">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </button>

  <Swiper
    modules={[Autoplay, Navigation, Pagination]}
    spaceBetween={20}
    slidesPerView={1}
    navigation={{ prevEl: ".best-prev", nextEl: ".best-next" }}
    pagination={{ clickable: true }}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    loop={sliderItems.length > 4}
    breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
    className="pb-28 sm:pb-24 px-2 best-sales-swiper"
  >
    {sliderItems.map((product) => (
      <SwiperSlide key={product._id} className="py-4">
        {/* SLIDER CARD CONTAINER */}
        <div className="group/card relative bg-white border border-gray-100 rounded-4xl p-4 md:p-5 transition-all hover:shadow-xl h-full flex flex-col overflow-hidden">
          
          {/* 1. OVERLAY LINK FOR CARD */}
          <Link 
            href={`/product/${product.slug.current}`} 
            className="absolute inset-0 z-10"
            aria-label={product.name}
          />

          {/* 2. IMAGE SECTION */}
          <div className="relative h-60 md:h-64 w-full bg-gray-50 rounded-3xl mb-4 overflow-hidden flex items-center justify-center z-0">
            {product.lessprice && (
              <div className="absolute top-3 left-3 z-20">
                <span className="bg-black text-white text-[9px] font-black px-2 py-1 rounded-md">SALE</span>
              </div>
            )}

            {/* Wishlist Button (z-20 and stopPropagation) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToWishlist(product);
              }}
              className="absolute top-3 right-3 z-20 p-2 bg-white rounded-full text-slate-400 hover:text-(--prim-color) border border-red-100 shadow-sm active:scale-90"
            >
              <Heart size={16} />
            </button>

            <div className="w-full h-full p-10 pointer-events-none">
              <Image
                src={urlFor(product.image[0]).url()}
                alt={product.name}
                fill
                className="object-contain transition-transform duration-500 group-hover/card:scale-110"
              />
            </div>
          </div>

          {/* 3. CONTENT SECTION */}
          <div className="px-1 flex flex-col flex-1 pointer-events-none">
            <h3 className="font-bold text-slate-900 text-sm md:text-base mb-1 truncate">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-lg font-black text-black">
                ₦{product.price?.toLocaleString()}
              </span>
              {product.lessprice && (
                <span className="text-[10px] text-gray-400 line-through font-bold">
                  ₦{product.lessprice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Cart Button (pointer-events-auto and stopPropagation) */}
            <div className="mt-auto pointer-events-auto">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="w-full relative z-20 py-3.5 bg-transparent border-2 border-red-100 text-(--prim-color) rounded-xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-red-50"
              >
                <ShoppingCart size={14} /> ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>
      <style jsx global>{`
        .best-sales-swiper .swiper-pagination {
          position: relative;
          margin-top: 6px;
        }
        .best-sales-swiper .swiper-pagination-bullet {
          background: #d1d5db !important;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .best-sales-swiper .swiper-pagination-bullet-active {
          background: black !important;
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
