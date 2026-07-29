"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { urlFor } from "@/app/lib/sanity";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/Components/LoadingSpinner";
import { brand } from "@/supermarket.config";

type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type CartItem = {
  _id: string;
  name: string;
  price: string | number;
  review: string | number;
  ctg?: string;
  qty: number;
  slug: { current: string };
  image: SanityImage[];
};

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const VAT_RATE = 0.001;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const loadCart = () => {
      try {
        const cart: CartItem[] = JSON.parse(
          localStorage.getItem("cart") || "[]",
        );

        setCartItems(cart);

        const total = cart.reduce((acc: number, item: CartItem) => {
          const quantity = item.qty ?? 1;

          const priceNum =
            typeof item.price === "number"
              ? item.price
              : parseFloat(
                  String(item.price || "0").replace(/[^0-9.-]+/g, ""),
                ) || 0;

          return acc + priceNum * quantity;
        }, 0);

        setSubtotal(total);
      } catch (error) {
        console.error("Failed to load cart", error);
        setCartItems([]);
      }
    };

    loadCart();

    window.addEventListener("storageUpdate", loadCart);

    return () => window.removeEventListener("storageUpdate", loadCart);
  }, []);

  const estimatedTax = subtotal * VAT_RATE;

  const grandTotal = subtotal + estimatedTax;

  const handleRemove = (productId: string) => {
    const itemToRemove = cartItems.find((item) => item._id === productId);

    const updatedCart = cartItems.filter((item) => item._id !== productId);

    setCartItems(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("storageUpdate"));

    if (itemToRemove) {
      toast.success(`${itemToRemove.name} removed from cart!`);
    }
  };

  const handleQtyChange = (productId: string, qty: number) => {
    const updatedCart = cartItems.map((item) =>
      item._id === productId ? { ...item, qty: Math.max(1, qty) } : item,
    );

    setCartItems(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("storageUpdate"));
  };

  const handleProceedToCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setTimeout(() => {
      router.push("/UI-Components/Pages/checkout");
    }, 2000);
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
          <h2 className="Unbounded text-lg md:text-2xl">Shopping Cart</h2>

          <div className="flex items-center gap-2 text-sm md:text-base">
            <Link href="/" className="hover:underline Unbounded">
              Home
            </Link>

            <span className="Unbounded">:</span>

            <span className="opacity-80 Unbounded">Cart</span>
          </div>
        </div>
      </div>

      <div className="px-[5%] lg:px-[12%] py-10">
        {cartItems.length === 0 ? (
          <div className="bg-red-50 text-red-600 text-2xl Unbounded p-6 rounded-lg border border-red-100">
            Your Cart is empty!{" "}
            <Link href="/" className="underline font-bold">
              Continue Shopping
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
                    <th className="py-5 px-6 font-medium">Quantity</th>
                    <th className="py-5 px-6 font-medium">Subtotal</th>
                    <th className="py-5 px-6 font-medium text-center">
                      Delete
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item: CartItem) => {
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
                              By {brand.name}
                            </h6>

                            <span className="flex items-center text-yellow-500 text-sm mt-1">
                              <i className="bi bi-star-fill me-1"></i>
                              {item.review} Reviews
                            </span>
                          </div>
                        </td>

                        <td className="py-5 px-6 font-semibold Unbounded text-gray-700">
                          ₦{priceNum.toLocaleString()}
                        </td>

                        <td className="py-5 px-6">
                          <div className="flex items-center border border-gray-300 rounded-md w-fit bg-white">
                            <button
                              onClick={() =>
                                handleQtyChange(item._id, item.qty - 1)
                              }
                              className="px-3 py-1 hover:bg-red-50"
                            >
                              -
                            </button>

                            <span className="px-4 py-1 border-x border-gray-300 text-sm font-bold">
                              {item.qty}
                            </span>

                            <button
                              onClick={() =>
                                handleQtyChange(item._id, item.qty + 1)
                              }
                              className="px-3 py-1 hover:bg-red-50"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-5 px-6 font-bold Unbounded text-(--prim-color)">
                          ₦{(priceNum * item.qty).toLocaleString()}
                        </td>

                        <td className="py-5 px-6 text-center">
                          <button
                            onClick={() => handleRemove(item._id)}
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

            <div className="w-full justify-end lg:sticky lg:top-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="Unbounded text-lg mb-6 pb-2 border-b">
                  Order Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span className="Unbounded">Subtotal :</span>
                    <span className="font-bold text-black Unbounded">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 text-sm">
                    <span className="Unbounded">Delivery Fee :</span>
                    <span className="text-[11px] text-gray-400 italic">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 text-sm">
                    <span className="Unbounded">Est. VAT (7.5%) :</span>
                    <span className="font-bold text-black Unbounded">
                      ₦{estimatedTax.toLocaleString()}
                    </span>
                  </div>

                  <hr className="border-dashed" />

                  <div className="flex justify-between text-lg pt-2">
                    <span className="Unbounded font-bold">
                      Total (excl. delivery) :
                    </span>
                    <span className="font-black text-(--prim-color) Unbounded">
                      ₦{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-(--prim-color) text-white py-4 rounded-lg font-bold mt-8 hover:brightness-110 transition-all Unbounded text-xs tracking-widest shadow-lg shadow-(--prim-color)/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      PROCESSING...
                    </>
                  ) : (
                    "PROCEED TO CHECKOUT"
                  )}
                </button>

                <div className="mt-6 flex items-center justify-center gap-4">
                  <Image
                    src="/categories/images/payment/payment-06.svg"
                    alt="pay stack"
                    width={80}
                    height={20}
                    className="object-contain"
                  />
                  <Image
                    src="/categories/images/payment/payment-01.svg"
                    alt="Visa"
                    width={40}
                    height={20}
                    className="object-contain"
                  />
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="master card"
                    width={30}
                    height={20}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}