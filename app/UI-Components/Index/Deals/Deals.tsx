"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { toast } from "react-toastify";
import LoadingSpinner from "@/app/Components/LoadingSpinner";
import { sanityFetch, urlFor } from "@/app/lib/sanity";

type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type DealProduct = {
  _id: string;
  title: string;
  name: string;
  price: number;
  lessPrice: number;
  details: string;
  slug: { current: string };
  review: number;
  image?: SanityImage[];
};

export default function Deals() {
  const [deals, setDeals] = useState<DealProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<DealProduct[]>([]);

  const shortName = (name: string, max = 32) =>
    name.length > max ? name.slice(0, max) + " –…" : name;

  type CartItem = DealProduct & { qty: number };

  const handleAddToCart = (product: DealProduct) => {
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

  useEffect(() => {
    let isMounted = true;

    async function fetchDeals() {
      try {
        const [dealsData, productsData] = await Promise.all([
          sanityFetch<DealProduct[]>(
            `*[_type == "product" && isBestDeal == true  && isBestOffer != true && isBestSales != true && isbanner != true && isShortProducts != true && isArrivals != true]
        | order(_createdAt desc)[0...3]{
         _id, name, price, lessprice, details, slug, image, review,title
      }`,
          ),
          sanityFetch<DealProduct[]>(
            `*[_type == "product" && isBestOffer != true && isTopSelling != true  && isHotDeal != true && isBestSales != true && isbanner != true && isShortProducts != true && isArrivals != true && isHero != true  && ispromo_banner != true]
        | order(_createdAt desc)[0...12]{
         _id, name, price, lessprice, details, slug, image, review, 
      }`,
          ),
        ]);

        if (isMounted) {
          setDeals(dealsData || []);
          setProducts(productsData || []);
        }
      } catch {
        if (isMounted) {
          setDeals([]);
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDeals();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center font-bold">
        <LoadingSpinner />
      </div>
    );
  if (products.length === 0) return null;

  return (
    <div className="px-[5%] lg:px-[8%] py-12 bg-white">
      <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
        <Image
          src="/categories/images/icons/icon-07.svg"
          alt="icon"
          width={17}
          height={17}
        />
        This Month&apos;s
      </span>
      <h1 className="text-2xl Unbounded mb-10">Today&apos;s Best Deals.</h1>

      <Swiper
        spaceBetween={25}
        loop
        modules={[Autoplay]}
        autoplay={{ delay: 4000 }}
        speed={1000}
        breakpoints={{
          1200: { slidesPerView: 3 },
          768: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
      >
        {deals.map((deal) => (
          <SwiperSlide key={deal._id}>
            <Link href={`/product/${deal.slug.current}`}>
              <div className="bg-white border border-red-100 p-7 rounded-2xl flex gap-6 h-60 shadow-[0_18px_45px_rgba(215,25,32,0.08)]">
                <div className="w-[50%] relative">
                  {deal.image?.[0]?.asset?._ref && (
                    <Image
                      src={urlFor(deal.image[0]).url()}
                      alt={deal.name}
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  )}
                </div>

                <div className="w-[60%] flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="Merienda font-bold line-clamp-2">
                      {deal.name}
                    </h2>
                    <p className="text-xs text-gray-500">{deal.title}</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(deal)}
                      className="px-3 py-2 rounded-full text-white font-bold bg-(--prim-color) hover:bg-(--prim-dark) border border-(--prim-color) transition-all"
                    >
                      Shop Now →
                    </button>

                    <p className="text-lg font-bold">
                      ₦{deal.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="my-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product.slug.current}`}
            className="group product-wrap"
          >
            <div className="aspect-square border border-gray-200 bg-white p-3 relative flex flex-col justify-between items-center text-center cursor-pointer">
              {/* IMAGE */}
              <div className="w-full h-[55%] flex items-center justify-center">
                {product.image?.[0]?.asset?._ref && (
                  <Image
                    src={urlFor(product.image[0]).url()}
                    alt={product.name}
                    width={90}
                    height={90}
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>

              {/* ADD TO CART */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="absolute top-2 right-2 z-10 px-2.5 py-1 text-xs font-semibold
                     text-(--prim-color) bg-(--prim-light) rounded-full
                     hover:bg-(--prim-color) hover:text-white transition"
              >
                Add <i className="bi bi-cart"></i>
              </button>

              {/* INFO */}
              <div className="mt-2 space-y-1">
                <h3 className="text-[13px] font-normal Unbounded leading-tight">
                  {shortName(product.name)}
                </h3>

                <div className="flex justify-center items-center gap-1 text-(--prim-color) text-[12px]">
                  <i className="bi bi-star-fill"></i>
                  <span>({product.review || 0}k)</span>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-400 line-through">
                    ₦{product.lessPrice || product.price + 5000}
                  </p>

                  <div className="flex items-end gap-1">
                    <p className="text-xl font-semibold text-black">
                      ₦{product.price.toLocaleString()}
                    </p>
                    <span className="text-sm text-gray-500">/Qty</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
