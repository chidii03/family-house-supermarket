import { notFound } from "next/navigation";
import { sanityFetch } from "@/app/lib/sanity";
import ProductGallery from "@/app/Components/ProductGallery";
import RelatedSlider from "@/app/Components/RelatedSlider";
import AddToCartSection from "@/app/Components/AddToCartSection";
import Link from "next/link";

// --- Types ---
interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  lessprice?: number;
  details: string;
  description?: string;
  slug: { current: string };
  image: SanityImage[];
  review: number;
}

interface Props {
  params: Promise<{ slug: string }>;
}

// --- Shuffle Helper ---
function shuffleArray<T>(array: T[]): T[] {
  // Fisher-Yates shuffle algorithm
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function generateStaticParams() {
  const products = await sanityFetch<{ slug: { current: string } }[]>(
    `*[_type == "product"]{ slug }`,
  );
  return products.map((p) => ({ slug: p.slug.current }));
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 1. Fetch Main Product
  const product = await sanityFetch<Product>(
    `*[_type == "product" && slug.current == $slug][0]`,
    { slug },
  );

  if (!product) return notFound();

  // 2. Fetch Large Pool of Related Products (e.g., 50 items)
  // We fetch more than we need so we can shuffle them
  const rawRelatedProducts = await sanityFetch<Product[]>(
    `*[_type == "product" && _id != $id][0...60]`,
    { id: product._id },
  );

  // 3. Randomize the arrays differently for each slider
  const shuffledTotal = shuffleArray(rawRelatedProducts);

  const alsoBought = shuffledTotal.slice(0, 15); // First 15 random items
  const browsingHistory = shuffledTotal.slice(15, 30); // Next 15 random items
  const recommended = shuffledTotal.slice(30, 45); // Next 15 random items

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumb */}
      <div className="bg-gray-100/50 border-b border-gray-200">
        <div className="max-w-360 mx-auto px-4 py-3 text-xs text-gray-500 font-medium flex items-center Unbounded gap-2">
          <span>Home</span> <i className="bi bi-chevron-right text-[10px]"></i>
          <div className="cursor-pointer">
            <Link href="/ShopAll">
              <span>Shop</span>{" "}
              <i className="bi bi-chevron-right text-[10px]"></i>
            </Link>
          </div>
          <span className="text-black truncate max-w-50 font-bold">
            {product.name}
          </span>
        </div>
      </div>

      <main className="max-w-360 mx-auto px-4 xl:px-8 py-8 Unbounded">
        {/* TOP SECTION: Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* LEFT: Image Gallery (Takes 5 cols) */}
          <div className="lg:col-span-5 xl:col-span-5 relative">
            <ProductGallery images={product.image} name={product.name} />
          </div>

          {/* CENTER: Details (Takes 4 cols) */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-5">
            <h1 className="text-2xl xl:text-3xl font-medium text-gray-900 leading-snug tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex text-(--prim-color)">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`bi ${i < 4 ? "bi-star-fill" : "bi-star-half"}`}
                  ></i>
                ))}
              </div>
              <span className="text-blue-600 font-bold">
                {product.review || 128} Verified Ratings
              </span>
            </div>

            <div className="border-t border-gray-100"></div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2 Unbounded">
                <span className="text-2xl font-black text-gray-900">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.lessprice && (
                  <span className="text-gray-400 text-sm line-through ">
                    ₦{product.lessprice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.lessprice && (
                <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-sm">
                  -
                  {Math.round(
                    ((product.lessprice - product.price) / product.lessprice) *
                      100,
                  )}
                  % Discount
                </span>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
              <p className="font-bold text-gray-800">Key Features:</p>
              <ul className="list-disc list-outside pl-4 space-y-1 text-gray-600 marker:text-(--prim-color)">
                {product.details
                  ?.split(".")
                  .slice(0, 5)
                  .map(
                    (point, i) =>
                      point.length > 5 && <li key={i}>{point.trim()}</li>,
                  )}
              </ul>
            </div>
          </div>

          {/* RIGHT: Buy Box (Takes 3 cols) */}
          <div className="lg:col-span-3 xl:col-span-3">
            <AddToCartSection product={product} />
          </div>
        </div>

        <div className="border-t border-gray-200 my-16"></div>

        {/* SLIDERS SECTION - Using the Shuffled Arrays */}
        <div className="space-y-16">
          <RelatedSlider
            title="Frequently bought together"
            products={alsoBought}
          />

          <RelatedSlider
            title="More supermarket picks"
            products={browsingHistory}
          />

          <RelatedSlider title="Recommended essentials" products={recommended} />
        </div>
      </main>
    </div>
  );
}
