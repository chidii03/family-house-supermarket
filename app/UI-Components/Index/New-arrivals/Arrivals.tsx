"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sanityFetch, urlFor } from "@/app/lib/sanity";
import Link from "next/link";

type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type Product = {
  _id: string;
  name: string;
  price: number;
  lessPrice: number;
  slug: { current: string };
  review: number;
  soldCurrent: number;
  soldTotal: number;
  image: SanityImage[];
  sale: string;
};

type CartItem = Product & { qty: number };

export default function Arrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        const query = `*[_type == "product" && isArrivals == true] | order(_createdAt desc)[0...16]{
          _id, name, price, "lessprice": lessPrice, slug, image, review, sale, soldCurrent, soldTotal
        }`;
        const data = await sanityFetch<Product[]>(query);
        setProducts(data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArrivals();
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
      toast(`${product.name} is already in your wishlist!`);
    } else {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("storageUpdate"));
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <div className="px-[5%] lg:px-[8%] py-12 bg-white">
      <span className="flex items-center gap-2.5 font-medium text-black mb-1.5">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.11826 15.4622C4.11794 16.6668 5.97853 16.6668 9.69971 16.6668H10.3007C14.0219 16.6668 15.8825 16.6668 16.8821 15.4622M3.11826 15.4622C2.11857 14.2577 2.46146 12.429 3.14723 8.77153C3.63491 6.17055 3.87875 4.87006 4.8045 4.10175M3.11826 15.4622C3.11826 15.4622 3.11826 15.4622 3.11826 15.4622ZM16.8821 15.4622C17.8818 14.2577 17.5389 12.429 16.8532 8.77153C16.3655 6.17055 16.1216 4.87006 15.1959 4.10175M16.8821 15.4622C16.8821 15.4622 16.8821 15.4622 16.8821 15.4622ZM15.1959 4.10175C14.2701 3.33345 12.947 3.33345 10.3007 3.33345H9.69971C7.0534 3.33345 5.73025 3.33345 4.8045 4.10175M15.1959 4.10175C15.1959 4.10175 15.1959 4.10175 15.1959 4.10175ZM4.8045 4.10175C4.8045 4.10175 4.8045 4.10175 4.8045 4.10175Z"
            stroke="#d71920"
            strokeWidth="1.5"
          />
          <path
            d="M7.64258 6.66678C7.98578 7.63778 8.91181 8.33345 10.0003 8.33345C11.0888 8.33345 12.0149 7.63778 12.3581 6.66678"
            stroke="#d71920"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        This Week’s
      </span>
      <h2 className="text-2xl Unbounded mb-10">New Arrivals</h2>

      {/* Best Selling Products */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product.slug.current}`}
            className="group border-[0.5px] border-gray-200 p-5 bg-white
                 flex flex-col justify-between transition-all
                 hover:shadow-xl relative cursor-pointer"
          >
            {/* IMAGE */}
            <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden mb-4">
              {product.image?.[0] && (
                <Image
                  src={urlFor(product.image[0]).url()}
                  alt={product.name}
                  width={130}
                  height={130}
                  className="object-contain transition-transform group-hover:scale-110"
                />
              )}

              {/* WISHLIST */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToWishlist(product);
                }}
                className="absolute top-0 left-0 w-10 h-10 rounded-full
                     bg-red-50 text-(--prim-color)
                     flex items-center justify-center
                     hover:bg-(--prim-color) hover:text-white transition-all"
              >
                <i className="bi bi-balloon-heart text-lg"></i>
              </button>

              {/* SALE BADGE */}
              {product.sale && (
                <span
                  className={`absolute off-product top-0 right-0 px-2 py-1 Merienda text-xs
              font-bold text-white rounded
              ${
                product.sale === "New"
                  ? "bg-(--prim-color)"
                  : product.sale.includes("%")
                    ? "bg-red-500"
                    : "opacity-0"
              }`}
                >
                  {product.sale}
                </span>
              )}
            </div>

            {/* INFO */}
            <div className="flex flex-col gap-2">
              {product.lessPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₦{product.lessPrice.toLocaleString()}
                </span>
              )}

              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-black">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-500">/Qty</span>
              </div>

              <h3 className="text-sm Unbounded font-medium text-gray-800 line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center gap-1 text-(--prim-color) text-xs">
                <i className="bi bi-star-fill"></i>
                <span>({product.review ?? 0})k</span>
              </div>

              <div className="text-sm Unbounded text-gray-500">
                Sold: {product.soldCurrent ?? 0} / {product.soldTotal ?? 0}
              </div>

              {/* ADD TO CART */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="mt-2 w-full py-2 border border-red-100 text-(--prim-color) text-xs font-bold rounded bg-red-50 hover:bg-(--prim-color) hover:text-white transition-all"
              >
                Add <i className="bi bi-cart3 ml-1"></i>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
