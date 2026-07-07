"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SearchBar from "@/app/Components/SearchBar";
import { brand } from "@/supermarket.config";

interface StorageItem {
  _id: string | number;
}

export default function MiddleNav() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const loadCounts = () => {
      const cartData = localStorage.getItem("cart");
      const wishlistData = localStorage.getItem("wishlist");

      const cart: StorageItem[] = cartData
        ? JSON.parse(cartData)
        : [];

      const wishlist: StorageItem[] = wishlistData
        ? JSON.parse(wishlistData)
        : [];

      const uniqueCart = new Set(
        cart.map((item) => item._id),
      );

      const uniqueWishlist = new Set(
        wishlist.map((item) => item._id),
      );

      setCartCount(uniqueCart.size);
      setWishlistCount(uniqueWishlist.size);
    };

    loadCounts();

    window.addEventListener(
      "storageUpdate",
      loadCounts,
    );

    window.addEventListener(
      "storage",
      loadCounts,
    );

    return () => {
      window.removeEventListener(
        "storageUpdate",
        loadCounts,
      );

      window.removeEventListener(
        "storage",
        loadCounts,
      );
    };
  }, []);

  return (
    <nav className="w-full bg-white text-gray-950 sticky top-0 z-50 border-b border-red-100">
      <div className="flex items-center justify-between py-2 px-[5%] lg:px-[8%] max-w-360 mx-auto gap-5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 mx-auto lg:mx-0"
        >
          <Image
            src={brand.logo}
            alt={brand.name}
            width={78}
            height={58}
            priority
            className="h-10 w-auto rounded-md object-contain bg-white"
          />

          {/* TEXT FIX */}
          <span className="flex flex-col leading-none">
            <span className=" text-medium font-black Unbounded text-gray-950 uppercase tracking-tight leading-none">
              Family House
            </span>

            <span className="mt-1 text-[9px] md:text-xs font-black tracking-[0.32em] uppercase text-(--prim-color)">
              Supermarket
            </span>
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-2 mx-8">
          <SearchBar variant="desktop" />
        </div>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            href="/wishlist"
            className="relative group h-12 w-12 rounded-full border border-red-100 bg-white text-(--prim-color) flex items-center justify-center hover:bg-red-50"
          >
            <i className="bi bi-heart text-xl group-hover:text-(--prim-color)"></i>

            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-1 bg-(--prim-color) text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative group h-12 w-12 rounded-full border border-red-100 bg-white text-(--prim-color) flex items-center justify-center hover:bg-red-50"
          >
            <i className="bi bi-cart3 text-xl group-hover:text-(--prim-color)"></i>

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-1 bg-(--prim-color) text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
