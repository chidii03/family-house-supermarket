import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  ShoppingBasket,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { brand, supermarketCategories } from "@/supermarket.config";

export default function AboutPage() {
  const features = [
    "Curated groceries, drinks, toiletries and household essentials",
    "Fresh bakery, frozen foods and chilled favourites",
    "Friendly neighbourhood service with quick checkout",
    "Quality products for everyday family shopping",
  ];

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(248,196,0,0.4),transparent_28%),linear-gradient(135deg,#101010_0%,#d71920_88%)]" />

        <div className="relative max-w-360 mx-auto grid gap-10 px-[5%] lg:px-[8%] py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-(--accent-color)">
              {brand.tagline}
            </span>

            <h1 className="mt-5 text-2xl md:text-4xl font-black Unbounded leading-tight">
              Your modern neighbourhood supermarket.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              Welcome to {brand.name}, a warm one-stop shopping destination for
              everything your home needs. We bring convenience, quality and
              community together with groceries, beverages, toiletries, bakery
              treats, frozen foods, household items, gadgets, wines and spirits
              under one roof.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/ShopAll"
                className="rounded-full bg-white px-7 py-4 text-sm font-black uppercase tracking-widest text-black hover:bg-(--accent-color)"
              >
                Shop Now
              </Link>

              <Link
                href="/UI-Components/Pages/contact"
                className="rounded-full border border-red-100 px-7 py-4 text-sm font-black uppercase tracking-widest text-(--prim-color) hover:bg-red-50"
              >
                Visit Store
              </Link>
            </div>
          </div>

          <div className="relative h-112.5 overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/about/brand/about-hero.jpeg"
              alt="Family House Supermarket"
              width={500}
              height={600}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-360 mx-auto px-[5%] lg:px-[8%] py-16">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: ShoppingBasket, title: "One-stop aisles" },
            { icon: Sparkles, title: "Premium everyday picks" },
            { icon: Truck, title: "Easy delivery flow" },
            { icon: CheckCircle2, title: "Trusted quality" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-red-100 bg-[#fffaf0] p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <item.icon className="h-8 w-8 text-(--prim-color)" />

              <h2 className="mt-5 text-lg font-black Unbounded">
                {item.title}
              </h2>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-360 mx-auto grid gap-10 px-[5%] lg:px-[8%] pb-20 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl md:text-4xl font-black Unbounded">
            Built for family shopping
          </h2>

          <p className="mt-5 text-gray-600 leading-8">
            Whether you are stocking up on kitchen essentials, grabbing
            something fresh from the bakery or picking up household care
            products, Family House keeps shopping simple, organised and
            welcoming.
          </p>

          <div className="mt-6 grid gap-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 text-sm font-bold text-gray-700"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-(--prim-color)" />

                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-black p-8 text-white">
          <MapPin className="h-8 w-8 text-(--accent-color)" />

          <h3 className="mt-5 text-2xl font-black Unbounded">
            Find us in Ikotun
          </h3>

          <p className="mt-4 text-white/75">{brand.address}</p>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              brand.address,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-(--accent-color) px-6 py-3 text-sm font-black uppercase tracking-widest text-black"
          >
            Open Maps
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* STORE GALLERY */}
      <section className="max-w-360 mx-auto px-[5%] lg:px-[8%] pb-20">
        <div className="text-center">
          <span className="text-sm font-black uppercase tracking-[0.3em] text-(--prim-color)">
            Inside Family House
          </span>

          <h2 className="mt-4 text-3xl md:text-5xl font-black Unbounded">
            Experience Our Store
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-gray-600 leading-8">
            From fully stocked grocery aisles to premium personal care products,
            our store is designed to provide a clean, comfortable and enjoyable
            shopping experience for every customer.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="relative h-105 overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/about/brand/about1.jpeg"
              alt="Grocery aisle"
              width={500}
              height={600}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>

          <div className="relative h-105 overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/about/brand/about2.jpeg"
              alt="Personal care section"
              width={500}
              height={600}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>

          <div className="relative h-105 overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/about/brand/about3.jpeg"
              alt="Family House Supermarket"
              width={500}
              height={600}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* POPULAR AISLES */}
      <section className="bg-[#fff8df] py-14">
        <div className="max-w-360 mx-auto px-[5%] lg:px-[8%]">
          <h2 className="text-2xl md:text-3xl font-black Unbounded">
            Popular aisles
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {supermarketCategories.map((category) => (
              <div
                key={category.title}
                className="rounded-2xl bg-white p-5 font-black uppercase text-sm text-gray-900 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {category.title}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
