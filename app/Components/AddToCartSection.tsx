"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getDeliveryEstimates } from "@/app/utils/deliveryDate";
import Image from "next/image";
import { brand } from "@/supermarket.config";

// --- Types ---
type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

interface DeliveryEstimate {
  standard: string;
  fastest: string;
  countdown: string;
}

interface Product {
  _id: string;
  
  name: string;
  price: number;
  image: SanityImage[];
  slug: { current: string };
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
  image: SanityImage[];
  slug: string;
}

interface Props {
  product: Product;
}

export default function AddToCartSection({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [delivery, setDelivery] = useState<DeliveryEstimate | null>(null);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDelivery(getDeliveryEstimates());
    const timer = setInterval(() => {
      setDelivery(getDeliveryEstimates());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleQtyChange = (amount: number) => {
    setQty(Math.max(1, amount));
  };
 
  // Inside AddToCartSection.tsx

const handleAddToCart = (isBuyNow = false) => {
  if (qty <= 0) return;

  const existingCart: CartItem[] = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const itemIndex = existingCart.findIndex(
    (item) => item._id === product._id
  );

  if (itemIndex > -1) {
    // Correctly incrementing based on the current local state 'qty'
    existingCart[itemIndex].qty += qty;
  } else {
    const newItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      qty: qty,
      image: product.image,
      slug: product.slug.current,
    };
    existingCart.push(newItem);
  }

  localStorage.setItem("cart", JSON.stringify(existingCart));

  window.dispatchEvent(new Event("storageUpdate"));
  window.dispatchEvent(new Event("storage")); 

  if (isBuyNow) {
    router.push("/UI-Components/Pages/checkout");
  } else {
    toast.success(`${qty} ${product.name} added to cart!`);
  }
};

  return (
    <div className="border border-red-100 rounded-2xl p-4 lg:p-6 shadow-lg bg-white sticky top-24">
      <h3 className="text-2xl font-black text-gray-900 mb-2 ">
        ₦{product.price.toLocaleString()}
      </h3>

      {delivery ? (
        <div className="text-sm text-gray-600 mb-6 space-y-2">
          <p>
            Delivery{" "}
            <span className="font-bold text-gray-900">{delivery.standard}</span>
          </p>
          <p>
            Or fastest delivery{" "}
            <span className="font-bold text-gray-900">{delivery.fastest}</span>.
            Order within{" "}
            <span className="text-[#00B517] font-bold">
              {delivery.countdown}
            </span>
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
            <i className="bi bi-geo-alt-fill text-(--prim-color)"></i>
            <span>
              Delivering from{" "}
              <span className="font-bold text-black">Ikotun, Lagos</span> ({brand.shortName})
            </span>
          </div>
        </div>
      ) : (
        <div className="h-20 animate-pulse bg-gray-100 rounded mb-6"></div>
      )}

      <div className="space-y-4">
        {/* Quantity Selector - RESPONSIVE UPDATE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <span className="text-sm font-bold text-gray-700">Quantity:</span>
          <div className="flex items-center justify-between sm:justify-start border border-gray-300 rounded-md bg-white w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleQtyChange(qty - 1)}
              className="px-3 py-2 hover:bg-red-50 text-lg transition-colors flex-1 sm:flex-none"
            >
              -
            </button>
            <span className="px-3 py-2 border-x border-gray-300 text-sm font-bold min-w-13 text-center bg-gray-50">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => handleQtyChange(qty + 1)}
              className="px-3 py-2 hover:bg-red-50 text-lg transition-colors flex-1 sm:flex-none"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleAddToCart(false)}
            className="w-full bg-white hover:bg-red-50 text-(--prim-color) border border-red-100 font-bold py-3 rounded-full shadow-sm transition-all active:scale-95 text-xs sm:text-sm uppercase tracking-wide"
          >
            Add to Cart
          </button>

          <button
            onClick={() => handleAddToCart(true)}
            className="w-full bg-(--prim-color) hover:brightness-90 text-white font-bold py-3 rounded-full shadow-md transition-all active:scale-95 text-xs sm:text-sm uppercase tracking-wide"
          >
            Buy Now
          </button>
        </div>

        {/* WhatsApp Chat Button - RESPONSIVE UPDATE */}
        <a
          href={`https://wa.me/${brand.whatsapp}?text=Hi, I have a question about ${encodeURIComponent(product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full border border-green-600 text-green-700 font-bold py-1 rounded-full hover:bg-green-50 transition-colors whitespace-nowrap uppercase tracking-wide"
        >
          <i className="bi bi-whatsapp text-2xl"></i>
          <span>Chat with us</span>
        </a>
      </div>

      <div className="mt-6 text-xs text-gray-500 space-y-2 border-t border-gray-100 pt-4">
        <div className="flex justify-between flex-wrap gap-1">
          <span>Delivery from</span>
          <span className="font-bold text-gray-900">{brand.name}</span>
        </div>
        <div className="flex justify-between flex-wrap gap-1">
          <span>Returns</span>
          <span className="text-(--prim-color)">30-Day Free Returns</span>
        </div>
      </div>

      {/* Payment Icons - RESPONSIVE UPDATE */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
          <i className="bi bi-shield-lock-fill text-xl text-green-600"></i>
          <span>Secure transaction</span>
        </div>
        {/* Added flex-wrap and justify-center to handle narrow screens */}
        <div className="flex justify-center gap-3">
          <Image
            src="/categories/images/payment/payment-01.svg"
            alt="visa"
            width={50}
            height={18}
            className="h-6 w-auto object-contain"
          />
          <Image
            src="/categories/images/payment/payment-06.svg"
            alt="paystack"
            width={100}
            height={60}
            className="h-6 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
