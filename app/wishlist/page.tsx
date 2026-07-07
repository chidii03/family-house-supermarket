"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { urlFor } from "@/app/lib/sanity";
import LoadingSpinner from "@/app/Components/LoadingSpinner";

type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

type WishlistItem = {
  _id: string;
  name: string;
  price: string | number;
  review: string | number;
  ctg?: string;
  slug: { current: string };
  image: SanityImage[];
};

type CartItem = {
  _id: string;
  name: string;
  price: string | number;
  review: string | number;
  ctg?: string;
  qty: number;
  image: SanityImage[];
};

export default function Wishlist() {
  const [WishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const loadWishlist = () => {
      try {
        const wishlist: WishlistItem[] = JSON.parse(
          localStorage.getItem("wishlist") || "[]",
        );
        setWishlistItems(wishlist);
      } catch (error) {
        console.error("Failed to load wislist", error);
        setWishlistItems([]);
      }
    };

    loadWishlist();
    window.addEventListener("storageUpdate", loadWishlist);
    return () => window.removeEventListener("storageUpdate", loadWishlist);
  }, []);

  const handleRemove = (productId: string, productName?: string) => {
    const updatedWishlist = WishlistItems.filter(
      (item) => item._id !== productId,
    );
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("storageUpdate"));

    if (productName) {
      toast.success(`${productName} removed from wishlist`);
    }
  };

  const handleAddToCart = (product: WishlistItem) => {
    const existingCart: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );
    const itemIndex = existingCart.findIndex(
      (item: CartItem) => item._id === product._id,
    );

    if (itemIndex > -1) {
      existingCart[itemIndex].qty += 1;
    } else {
      const newItem: CartItem = {
        ...product,
        qty: 1,
      };
      existingCart.push(newItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    const updatedWishlist = WishlistItems.filter(
      (item) => item._id !== product._id,
    );
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    window.dispatchEvent(new Event("storageUpdate"));

    toast.success(`${product.name} moved to cart!`);
  };

  if (!mounted)
    return (
      <div className="py-20 text-center font-bold">
        <LoadingSpinner />
      </div>
    );
  return (
    <>
      <div className="px-[5%] lg:px-[12%] bg-(--prim-color) text-white py-5 mt-2">
        <div className="flex justify-between items-center">
          <h2 className="Unbounded text-lg md:text-2xl">Wishlist</h2>
          <div className="flex items-center gap-2 text-sm md:text-base">
            <Link href="/" className="hover:underline Unbounded">
              Home
            </Link>
            <span className="Unbounded">:</span>
            <span className="opacity-80 Unbounded">Wishlist</span>
          </div>
        </div>
      </div>

      <div className="px-[5%] lg:px-[12%] py-10">
        {WishlistItems.length === 0 ? (
          <div className="bg-red-50 text-red-600 text-2xl Unbounded p-6 rounded-lg border border-red-100">
            Your Wishlist is empty !{" "}
            <Link href="/" className="underline font-bold">
              {" "}
              Back to Store{" "}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <div className="w-full overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
              <table className="min-w-200 w-full bg-white text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="Unbounded text-[12px] uppercase tracking-wider text-gray-600">
                    <th className="py-5 px-6 font-medium">Product</th>
                    <th className="py-5 px-6 font-medium">Price</th>
                    <th className="py-5 px-6 font-medium whitespace-nowrap">
                      Stock Status
                    </th>
                    <th className="py-5 px-6 font-medium whitespace-nowrap">
                      Add to Cart
                    </th>
                    <th className="py-5 px-6 font-medium text-center">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {WishlistItems.map((item) => {
                    const priceNum =
                      typeof item.price === "number"
                        ? item.price
                        : parseFloat(
                            String(item.price || "0").replace(/[^0-9.-]+/g, ""),
                          ) || 0;

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-red-50 transition-colors"
                      >
                        <td className="py-5 px-6 flex items-center gap-4">
                          {/* <Link href={`/product/${item.slug.current}`}> */}
                            <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                              {item.image?.[0] ? (
                                <Image
                                  src={urlFor(item.image[0]).url()}
                                  alt={item.name}
                                  fill
                                  className="object-contain p-2"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>
                          {/* </Link> */}
                          <div>
                            <p className="font-bold text-gray-800 text-sm md:text-base Unbounded line-clamp-2">
                              {item.name}
                            </p>
                            <h6 className="text-xs text-gray-400 mt-1 Merienda tracking-tighter">
                              <i className="bi bi-shop text-(--prim-color)"></i>{" "}
                              By Steve Obizz&apos;s Store
                            </h6>
                            <span className="flex items-center text-yellow-500 text-sm mt-1">
                              <i className="bi bi-star-fill me-1"></i>
                              {item.review} Reviews
                            </span>
                          </div>
                        </td>

                        {/* PRICE */}
                        <td className="py-5 px-6 font-semibold Unbounded text-gray-700">
                          ₦{priceNum.toLocaleString()}
                        </td>

                        {/* STOCK */}
                        <td className="py-5 px-6 Unbounded whitespace-nowrap">
                          <span className="px-3 py-1 bg-green-100 text-green-600 text-[13px] rounded-full border border-green-100">
                            In Stock
                          </span>
                        </td>
                        {/* ADD TO CART BUTTON */}
                        <td className="py-5 px-6 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-(--prim-color) text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all tracking-widest shadow-(--prim-color)/20 shadow-md active:scale-95 cursor-pointer"
                          >
                            <span>ADD TO CART</span>
                            <i className="bi bi-cart3"></i>
                          </button>
                        </td>

                        {/* REMOVE ACTION */}
                        <td className="py-5 px-6 text-center">
                          <button
                            onClick={() => handleRemove(item._id, item.name)}
                            className="text-red-500 cursor-pointer transition-colors"
                          >
                            <i className="bi bi-trash3 text-xl"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
