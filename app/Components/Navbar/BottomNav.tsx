"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "@/app/Components/SearchBar";
import { brand, slugify, supermarketCategories } from "@/supermarket.config";

type NavLink = {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
};

interface StorageItem {
  _id: string | number;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/ShopAll",
    dropdown: [
      { label: "CheckOut", href: "/UI-Components/Pages/checkout"},
      { label: "Flash Sales", href: "/FlashSales" },
      { label: "New Arrivals", href: "/ShopAll" },
    ],
  },
  { label: "About", href: "/UI-Components/Pages/about" },
  { label: "Contact", href: "/UI-Components/Pages/contact" },
];

export default function BottomNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(supermarketCategories[0]);
  const [isFixed, setIsFixed] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsFixed(window.scrollY > 110);
    window.addEventListener("scroll", handleScroll);

    const loadCounts = () => {
      const cartData = localStorage.getItem("cart");
      const wishlistData = localStorage.getItem("wishlist");
      const cart: StorageItem[] = cartData ? JSON.parse(cartData) : [];
      const wishlist: StorageItem[] = wishlistData ? JSON.parse(wishlistData) : [];

      setCartCount(new Set(cart.map((i) => i._id)).size);
      setWishlistCount(new Set(wishlist.map((i) => i._id)).size);
    };

    loadCounts();
    window.addEventListener("storage", loadCounts);
    window.addEventListener("storageUpdate", loadCounts);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", loadCounts);
      window.removeEventListener("storageUpdate", loadCounts);
    };
  }, []);

  const toggleMobileDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setIsCatOpen(false);
    setOpenDropdowns({});
  };

  return (
    <div
      className={`w-full bg-white transition-all duration-300 border-b border-red-100 ${
        isFixed ? "fixed top-0 left-0 z-50 shadow-lg fixed-nav" : "relative"
      }`}
    >
      <div className="flex items-center justify-between px-[5%] lg:px-[8%] h-16 max-w-360 mx-auto relative">
        <nav className="hidden lg:flex space-x-7 items-center">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group py-5">
              <Link
                href={link.href}
                className="flex items-center gap-1 text-medium font-black Unbounded text-gray-900 hover:text-(--prim-color) transition-colors"
              >
                {link.label}
                {link.dropdown && <i className="ri-arrow-down-s-line" />}
              </Link>

              {link.dropdown && (
                <div className="absolute left-0 top-[90%] hidden group-hover:block bg-white shadow-2xl p-2 border border-red-100 rounded-2xl min-w-45 z-50">
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeMenus}
                      className="block px-3 py-2 rounded-md text-sm font-black Unbounded text-gray-700 hover:bg-(--prim-color) hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div
          className="m-10 hidden lg:block py-6"
          onMouseEnter={() => setIsCatOpen(true)}
          onMouseLeave={() => setIsCatOpen(false)}
        >
          <button className="flex items-center gap-2 font-black text-white bg-(--prim-color) px-5 py-3 rounded-3xl tracking-tight text-xs uppercase cursor-pointer shadow-[0_12px_24px_rgba(215,25,32,0.18)] hover:bg-(--prim-dark)">
            <i className="bi bi-grid-3x3-gap-fill" />
            Shop by Category
            <i
              className={`bi bi-chevron-down transition-transform duration-300 ${
                isCatOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`absolute left-1/2 -translate-x-1/2 top-full w-[95vw] xl:w-310 z-10000 transition-all duration-300 ease-out ${
              isCatOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="bg-white border border-red-100 shadow-[0_30px_80px_rgba(16,16,16,0.22)] rounded-lg overflow-hidden flex h-[74vh] max-h-170 mt-2">
              <div className="w-[30%] bg-red-50 p-4 overflow-y-auto border-r border-red-100">
                {supermarketCategories.map((cat) => (
                  <button
                    key={cat.title}
                    onMouseEnter={() => setActiveCategory(cat)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl cursor-pointer mb-1.5 transition-all text-left ${
                      activeCategory.title === cat.title
                        ? "bg-(--prim-color) shadow-md text-white"
                        : "text-gray-700 hover:bg-(--prim-color) hover:text-white"
                    }`}
                  >
                    <i className={`bi ${cat.icon} text-xl shrink-0`} />
                    <span className="flex flex-col overflow-hidden">
                      <span className="font-black text-[13px] uppercase leading-tight truncate tracking-tight">
                        {cat.title}
                      </span>
                      <span className="text-[10px] opacity-60 font-bold">
                        {cat.products}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="w-[70%] bg-white p-8 overflow-y-auto">
                <div className="flex justify-between items-start gap-5 mb-8 border-b border-red-50 pb-6">
                  <div>
                    <h2 className="text-3xl font-black Unbounded text-gray-950 uppercase tracking-tighter">
                      {activeCategory.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 max-w-xl">
                      {activeCategory.description}
                    </p>
                  </div>

                  <Link
                    href={`/shop/${slugify(activeCategory.title)}`}
                    onClick={closeMenus}
                    className="bg-(--prim-color) text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-(--prim-dark) whitespace-nowrap transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-9 gap-y-10">
                  {activeCategory.subCategories.map((sub) => (
                    <div key={sub.name} className="flex flex-col gap-4">
                      <Link
                        href={`/shop/${slugify(activeCategory.title)}/${slugify(sub.name)}`}
                        onClick={closeMenus}
                        className="text-[12px] font-black text-gray-950 uppercase tracking-[0.12em] border-l-4 border-(--prim-color) pl-3 hover:text-(--prim-color) transition-colors"
                      >
                        {sub.name}
                      </Link>

                      <div className="flex flex-col gap-2.5">
                        {sub.items.map((item) => (
                          <Link
                            key={item}
                            href={`/shop/${slugify(activeCategory.title)}/${slugify(sub.name)}/${slugify(item)}`}
                            onClick={closeMenus}
                            className="text-[14px] text-gray-600 font-bold hover:text-(--prim-color) transition-all hover:translate-x-1"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-3 text-sm">
          <Link
            href="/wishlist"
            className="relative text-gray-700 hover:text-(--prim-color)"
            aria-label="Wishlist"
          >
            <i className="bi bi-heart text-xl" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-(--prim-color) text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-(--prim-color)"
            aria-label="Cart"
          >
            <i className="bi bi-cart3 text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-(--prim-color) text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="lg:hidden flex items-center justify-between w-full py-4 gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-15 h-9 flex items-center justify-center bg-(--prim-color) text-white rounded-full"
            aria-label="Open menu"
          >
            <i
              className={
                mobileMenuOpen
                  ? "ri-close-line text-2xl"
                  : "ri-menu-2-line text-2xl"
              }
            />
          </button>

          <SearchBar variant="mobile" />

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/wishlist"
              className="relative text-gray-800"
              aria-label="Wishlist"
            >
              <i className="bi bi-heart text-[22px]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-(--prim-color) text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative text-gray-800"
              aria-label="Cart"
            >
              <i className="bi bi-cart3 text-[22px]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-(--prim-color) text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-10000 lg:hidden transition-transform duration-500 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        <div className="relative w-[88%] max-w-sm h-full bg-white overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
            <span className="font-black Unbounded text-base uppercase tracking-tight">
              {brand.shortName}
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <i className="bi bi-x-lg text-xl" />
            </button>
          </div>

          <nav className="p-6 space-y-4">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(link.label)}
                      className="flex items-center justify-between w-full text-2xl Unbounded font-black text-gray-900 py-2"
                    >
                      {link.label}
                      <i
                        className={`ri-arrow-down-s-line transition-transform ${
                          openDropdowns[link.label] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`pl-4 space-y-2 overflow-hidden transition-all ${
                        openDropdowns[link.label] ? "max-h-60 mt-2" : "max-h-0"
                      }`}
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMenus}
                          className="block text-2xl Unbounded font-black text-gray-700 hover:text-(--prim-color) py-1"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={closeMenus}
                    className="block text-2xl Unbounded font-black text-gray-900 hover:text-(--prim-color)"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="px-6 py-4 border-t">
            <h3 className="text-xs font-black Unbounded text-gray-400 uppercase tracking-widest mb-4">
              Shop Categories
            </h3>

            <div className="space-y-2">
              {supermarketCategories.map((cat) => (
                <div
                  key={cat.title}
                  className="rounded-2xl border border-red-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleMobileDropdown(cat.title)}
                    className={`flex items-center justify-between w-full p-4 transition-colors ${
                      openDropdowns[cat.title]
                        ? "bg-(--prim-color) text-white"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <i className={`bi ${cat.icon} shrink-0`} />
                      <span className="font-bold text-sm uppercase truncate">
                        {cat.title}
                      </span>
                    </div>
                    <i
                      className={`bi bi-chevron-down transition-transform ${
                        openDropdowns[cat.title] ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openDropdowns[cat.title]
                        ? "max-h-[60vh] overflow-y-auto bg-red-50"
                        : "max-h-0 overflow-hidden"
                    }`}
                  >
                    <div className="p-4 space-y-6">
                      <Link
                        href={`/shop/${slugify(cat.title)}`}
                        onClick={closeMenus}
                        className="block w-full text-center bg-(--prim-color) text-white py-3 rounded-xl font-bold text-xs uppercase"
                      >
                        Shop All {cat.title}
                      </Link>

                      {cat.subCategories.map((sub) => (
                        <div key={sub.name} className="space-y-3">
                          <Link
                            href={`/shop/${slugify(cat.title)}/${slugify(sub.name)}`}
                            onClick={closeMenus}
                            className="text-[10px] font-black text-(--prim-color) uppercase tracking-widest block hover:underline"
                          >
                            {sub.name}
                          </Link>

                          <div className="flex flex-col gap-3 pl-4 border-l border-red-100">
                            {sub.items.map((it) => (
                              <Link
                                key={it}
                                href={`/shop/${slugify(cat.title)}/${slugify(sub.name)}/${slugify(it)}`}
                                onClick={closeMenus}
                                className="text-sm font-bold text-gray-600 hover:text-(--prim-color) transition-colors"
                              >
                                {it}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
