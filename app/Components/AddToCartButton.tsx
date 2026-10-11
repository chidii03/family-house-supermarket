"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";


// --- TYPES ---
type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

// Define the type here or import it if you have a types file
type Product = {
  _id: string;
  inStock?: boolean;
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

export default function AddToCartButton({ product }: { product: Product }) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (product.inStock === false) {
      toast.error(`${product.name} is currently out of stock.`);
      return;
    }

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

  return (
    <>
      {/* Mobile: Full Width Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.inStock === false}
        className="md:hidden w-full bg-(--prim-color) text-white font-bold py-3 rounded-full text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform mt-4"
      >
        <ShoppingCart className="w-4 h-4" /> {product.inStock === false ? "Out of Stock" : "Add to Cart"}
      </button>

      {/* Desktop: Side Button */}
      <div className="hidden md:flex flex-col justify-center items-center w-full">
        <button
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className="w-full bg-(--prim-color) hover:opacity-90 text-white font-medium py-2.5 rounded-full shadow-md text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
        >
          <ShoppingCart className="w-4 h-4" /> {product.inStock === false ? "Out of Stock" : "Buy"}
        </button>
      </div>
    </>
  );
}
