"use client";

import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "@/app/lib/api";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { urlFor } from "@/app/lib/sanity";
import { brand } from "@/supermarket.config";
import {
  calculateDeliveryFee,
  FREE_DELIVERY_THRESHOLD,
  LAGOS_AREA_OPTIONS,
  type LagosArea,
} from "@/app/lib/delivery";

type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

type CartItem = {
  _id: string;
  name: string;
  price: string | number;
  qty: number;
  image: SanityImage[];
};

// All 36 Nigerian States + FCT
const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function Checkout() {
  const [deliveryOption, setDeliveryOption] = useState<"ship" | "pickup">(
    "ship",
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [Loading, setLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const VAT_RATE = 0.001;

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    state: "",
    lagosArea: "" as LagosArea | "",
    newsletter: false,
  });

  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  useEffect(() => {
    const saveCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(saveCart);
  }, []);

  // 1. Base Subtotal
  const baseSubtotal = cartItems.reduce((acc, item) => {
    const priceNum =
      typeof item.price === "number"
        ? item.price
        : parseFloat(String(item.price || "0").replace(/[^0-9.-]+/g, "")) || 0;
    return acc + priceNum * (item.qty || 1);
  }, 0);

  // 2. Delivery Fee — Alimosho flat rate, free above the threshold,
  //    tiered by Lagos area / state zone otherwise. Only calculated here
  //    on checkout, never on the cart page.
  const deliveryFee =
    deliveryOption === "pickup"
      ? 0
      : cartItems.length > 0
        ? calculateDeliveryFee({
            state: formData.state,
            lagosArea: formData.lagosArea || undefined,
            subtotal: baseSubtotal,
          })
        : 0;

  const qualifiesForFreeDelivery =
    deliveryOption === "ship" && baseSubtotal >= FREE_DELIVERY_THRESHOLD;

  const amountLeftForFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - baseSubtotal,
  );

  // 3. Tax Logic (matches Cart)
  const estimatedTax = baseSubtotal * VAT_RATE;

  // 4. Grand Total
  const finalGrandTotal = Math.max(
    0,
    baseSubtotal + deliveryFee + estimatedTax - discountAmount,
  );

  const applyFamilyHouseDiscount = () => {
    const MINIMUM_ORDER = 50000;
    if (discountCode.trim().toUpperCase() !== "FAMILY") {
      toast.error("Invalid discount code.");
      return;
    }
    if (baseSubtotal < MINIMUM_ORDER) {
      toast.error(
        `Order must be above ₦${MINIMUM_ORDER.toLocaleString()} to use this code.`,
      );
      return;
    }
    if (isDiscountApplied) {
      toast.error("Discount already applied.");
      return;
    }
    const calculatedDiscount = Math.min(baseSubtotal * 0.02, 2000);
    setDiscountAmount(calculatedDiscount);
    setIsDiscountApplied(true);
    toast.success("Discount applied successfully");
  };

  const removeDiscount = () => {
    setDiscountCode("");
    setDiscountAmount(0);
    setIsDiscountApplied(false);
    toast.success("Discount removed");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset the Lagos area whenever the state changes away from Lagos,
      // so a stale area value can't sneak into a non-Lagos order.
      ...(name === "state" && value !== "Lagos" ? { lagosArea: "" } : {}),
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const email = emailInputRef.current?.value.trim() || formData.email.trim() || "";
    const phone = phoneInputRef.current?.value.trim() || formData.phone.trim() || "";

    const missingContactDetails =
      !email ||
      !phone ||
      (deliveryOption === "ship" &&
        (!formData.firstName || !formData.lastName));

    if (deliveryOption === "ship" && missingContactDetails) {
      toast.error("Please fill in all contact details.");
      setLoading(false);
      return;
    }

    if (deliveryOption === "ship" && (!formData.address || !formData.state)) {
      toast.error("Please provide a delivery address.");
      setLoading(false);
      return;
    }

    if (
      deliveryOption === "ship" &&
      formData.state === "Lagos" &&
      !formData.lagosArea
    ) {
      toast.error("Please select your area within Lagos.");
      setLoading(false);
      return;
    }

    const lagosAreaLabel = LAGOS_AREA_OPTIONS.find(
      (a) => a.value === formData.lagosArea,
    )?.label;

    // Prepare Order Data
    const orderData = {
      email,
      phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address:
        deliveryOption === "pickup"
          ? `PICKUP FROM STORE - ${brand.address}`
          : `${formData.address}${
              lagosAreaLabel ? `, ${lagosAreaLabel}` : ""
            }, ${formData.state}`,
      state: formData.state || "Lagos",
      deliveryMethod: deliveryOption,
      pickupInfo: deliveryOption === "pickup" ? `PICKUP FROM STORE - ${brand.address}` : null,
      lagosArea: formData.lagosArea || null,
      deliveryFee,
      amount: finalGrandTotal,
      cart: cartItems,
      discountUsed: isDiscountApplied ? "FAMILY" : null,
      discountAmount: discountAmount,
    };

    try {
      const res = await fetch(`${API_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        localStorage.setItem("pending_order_reference", data.reference || data.orderId);
        toast.success("Processing Payment...");
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Order failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not connect to server. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-[5%] lg:px-[12%] bg-(--prim-color) text-white py-5 mt-2">
        <div className="flex justify-between items-center">
          <h2 className="Unbounded text-lg md:text-2xl font-bold">Checkout</h2>
          <div className="flex items-center gap-2 text-sm md:text-base">
            <Link href="/" className="hover:underline Unbounded">
              Home
            </Link>
            <span className="Unbounded">:</span>
            <span className="opacity-80 Unbounded">Checkout</span>
          </div>
        </div>
      </div>

      <div className="px-[5%] lg:px-[12%] py-5">
        <div className="grid gap-8 lg:grid-cols-12 items-center justify-center">
          {/* LEFT SIDE: Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h5 className="mb-4 Unbounded text-xl font-bold text-gray-800 border-b pb-2 whitespace-nowrap">
                Contact Information
              </h5>
              <input
                ref={emailInputRef}
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                className="border border-gray-300 w-full p-3 rounded-lg mb-4 focus:ring-2 focus:ring-(--prim-color) outline-none"
                placeholder="Email Address"
                required
              />
              <input
                ref={phoneInputRef}
                name="phone"
                type="tel"
                onChange={handleChange}
                value={formData.phone}
                className="border border-gray-300 w-full p-3 rounded-lg mb-4 focus:ring-2 focus:ring-(--prim-color) outline-none"
                placeholder="Phone Number (WhatsApp)"
                required
              />

              <h5 className="mb-4 mt-8 Unbounded text-xl font-bold text-gray-800 border-b pb-2">
                Delivery Method
              </h5>
              <div className="mb-6 flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryOption === "ship"}
                    onChange={() => setDeliveryOption("ship")}
                    className="accent-(--prim-color)"
                  />
                  <span className="font-medium">Deliver to address</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryOption === "pickup"}
                    onChange={() => setDeliveryOption("pickup")}
                    className="accent-(--prim-color)"
                  />
                  <span className="font-medium">Pickup</span>
                </label>
              </div>

              {deliveryOption === "ship" && (
                <>
                  {!qualifiesForFreeDelivery && amountLeftForFreeDelivery > 0 && (
                    <p className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-xs font-semibold text-(--prim-color)">
                      Add ₦{amountLeftForFreeDelivery.toLocaleString()} more
                      to your order for FREE delivery.
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="state"
                      onChange={handleChange}
                      value={formData.state}
                      size={1}
                      className="border border-gray-300 rounded-lg p-3 md:col-span-2 bg-white cursor-pointer focus:ring-2 focus:ring-(--prim-color) outline-none appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                      required
                    >
                      <option value="">Select your state</option>
                      {NIGERIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>

                    {/* Only shown for Lagos — this is what lets us tell
                        Alimosho apart from Mainland / Island for pricing. */}
                    {formData.state === "Lagos" && (
                      <select
                        name="lagosArea"
                        onChange={handleChange}
                        value={formData.lagosArea}
                        className="border border-gray-300 rounded-lg p-3 md:col-span-2 bg-white cursor-pointer focus:ring-2 focus:ring-(--prim-color) outline-none appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                        required
                      >
                        <option value="">Select your area in Lagos</option>
                        {LAGOS_AREA_OPTIONS.map((area) => (
                          <option key={area.value} value={area.value}>
                            {area.label}
                          </option>
                        ))}
                      </select>
                    )}

                    <input
                      name="firstName"
                      onChange={handleChange}
                      value={formData.firstName}
                      className="border border-gray-300 rounded-lg p-3"
                      placeholder="First Name"
                      required
                    />
                    <input
                      name="lastName"
                      onChange={handleChange}
                      value={formData.lastName}
                      className="border border-gray-300 rounded-lg p-3"
                      placeholder="Last Name"
                      required
                    />
                    <input
                      name="address"
                      onChange={handleChange}
                      value={formData.address}
                      className="border border-gray-300 rounded-lg p-3 md:col-span-2"
                      placeholder="Street Address"
                      required
                    />
                  </div>
                </>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={Loading}
                className="w-full bg-(--prim-color) text-white py-4 rounded-xl font-bold mt-8 hover:opacity-90 transition-all Unbounded text-sm uppercase tracking-widest disabled:opacity-70"
              >
                {Loading
                  ? "PROCESSING..."
                  : `PAY NOW — ₦${finalGrandTotal.toLocaleString()}`}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Order Summary */}
          <div className="lg:col-span-5 sticky top-6 pt-10">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md">
              <h5 className="font-bold mb-4 flex items-center gap-2 Unbounded text-lg">
                <i className="ri-shopping-cart-2-line text-(--prim-color)"></i>{" "}
                Order Summary
              </h5>

              {/* Cart Items List */}
              <div className="max-h-95 overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-gray-300 pt-3">
                {cartItems.map((item) => {
                  const priceNum =
                    typeof item.price === "number"
                      ? item.price
                      : parseFloat(
                          String(item.price || "0").replace(/[^0-9.-]+/g, ""),
                        ) || 0;
                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 border-b border-gray-50 pb-3 last:border-0"
                    >
                      <div className="relative shrink-0">
                        {item.image && item.image[0] ? (
                          <Image
                            src={urlFor(item.image[0]).url()}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-contain bg-gray-50"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded-lg"></div>
                        )}
                        <span className="absolute -top-2 -right-2 bg-(--prim-color) text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                          {item.qty}
                        </span>
                      </div>
                      <div className="grow">
                        <h6 className="Unbounded text-xs font-semibold text-gray-800 line-clamp-1">
                          {item.name}
                        </h6>
                        <p className="text-(--prim-color) font-bold text-xs">
                          ₦{priceNum.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Discount Input */}
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-700 mb-2 block">
                  Discount Code
                </div>
                {!isDiscountApplied ? (
                  <div className="flex flex-wrap gap-2 ">
                    <input
                      value={discountCode}
                      onChange={(e) =>
                        setDiscountCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter Code FAMILY"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-3 uppercase focus:outline-none"
                    />
                    <button
                      onClick={applyFamilyHouseDiscount}
                      className="bg-(--prim-color) Unbounded text-white w-full py-2 rounded-lg text-sm font-bold hover:opacity-90 tracking-widest"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-green-800 font-medium">
                        Applied:{" "}
                      </span>
                      <span className="font-bold text-green-900">
                        {discountCode}
                      </span>
                      <span className="text-green-700 ml-1">
                        (-₦{discountAmount.toLocaleString()})
                      </span>
                    </div>
                    <button
                      onClick={removeDiscount}
                      className="Unbounded text-red-500 text-xs font-bold px-2 py-1 pl-8 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Totals Section */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-500">
                  <span className="Unbounded text-sm">Subtotal</span>
                  <span className="Unbounded text-sm font-semibold text-gray-800">
                    ₦{baseSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span className="Unbounded text-sm">Delivery Fee</span>
                  <span className="Unbounded text-sm font-semibold text-gray-800">
                    {deliveryOption === "pickup" ? (
                      "₦0 (Pickup)"
                    ) : qualifiesForFreeDelivery ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₦${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span className="Unbounded text-sm">Est. VAT</span>
                  <span className="Unbounded text-sm font-semibold text-gray-800">
                    ₦{estimatedTax.toLocaleString()}
                  </span>
                </div>

                {isDiscountApplied && (
                  <div className="flex justify-between text-green-600">
                    <span className="Unbounded text-sm">Discount</span>
                    <span className="Unbounded text-sm font-semibold">
                      -₦{discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-4 mt-2 border-t-2 border-gray-50">
                  <span className="Unbounded text-lg font-bold text-gray-900">
                    Total
                  </span>
                  <span className="Unbounded text-xl font-black text-(--prim-color)">
                    ₦{finalGrandTotal.toLocaleString()}
                  </span>
                </div>

                <Link href="/cart">
                  <div className="bg-(--prim-color) text-white border mt-8 hover:opacity-90 tracking-widest border-gray-200 rounded-md px-4 py-2 w-full flex items-center justify-center">
                    <button className="font-bold Unbounded">
                      Back to Cart
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
