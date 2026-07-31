import { client, urlFor } from "@/app/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import { Star, Truck, AlertCircle, Filter, ArrowUpDown } from "lucide-react";
import AddToCartButton from "@/app/Components/AddToCartButton";

export const dynamic = "force-dynamic";

// --- TYPES ---
type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

// Exporting this so other components can use it if needed
export type Product = {
  _id: string;
  name: string;
  price: number;
  lessprice?: number;
  oldPrice?: number; // Added this as it was missing in type but used in code
  slug: { current: string };
  image: SanityImage[];
  sale: string;
  soldCurrent: number;
  soldTotal: number;
  BestSales?: number;
  review?: number;
  details?: string;
  category?: string;
  tags?: string[];
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
  }>;
}

// Fixed "any" in props
interface SortOptionProps {
  label: string;
  value: string;
  currentSort: string;
  query: string;
}

const SortOption = ({ label, value, currentSort, query }: SortOptionProps) => {
  const active = currentSort === value;

  return (
    <Link
      href={`/search?q=${query}&sort=${value}`}
      className={`block px-4 py-2 text-sm ${
        active
          ? "bg-(--prim-color) text-white"
          : "text-gray-700 hover:bg-red-50 hover:text-(--prim-color)"
      }`}
    >
      {label}
    </Link>
  );
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const awaitedParams = await searchParams;
  const query = awaitedParams.q || "";
  const sort = awaitedParams.sort || "newest";
  const minPrice = awaitedParams.minPrice ? Number(awaitedParams.minPrice) : 0;
  const maxPrice = awaitedParams.maxPrice
    ? Number(awaitedParams.maxPrice)
    : 10000000;
  const minRating = awaitedParams.rating ? Number(awaitedParams.rating) : 0;

  if (!query) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-white">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">
          Please enter a search term
        </h2>
      </div>
    );
  }

  // --- Construct GROQ Query ---
  let orderClause = "| order(_createdAt desc)";
  if (sort === "price_asc") orderClause = "| order(price asc)";
  if (sort === "price_desc") orderClause = "| order(price desc)";
  if (sort === "rating") orderClause = "| order(review desc)";

  const sanityQuery = `*[_type == "product" && (
    name match "*${query}*" || 
    details match "*${query}*" ||
    category->title match "*${query}*" ||
    tags[] match "*${query}*"
  ) && price >= ${minPrice} && price <= ${maxPrice} && review >= ${minRating}] ${orderClause} {
    _id,
    name,
    "slug": slug.current,
    price,
    oldPrice, 
    details,
    image, // Changed to fetch all images to match type
    "category": category->title,
    review
  }`;

  const products: Product[] = await client.fetch(sanityQuery);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      {/* --- Top Bar: Results Count & Sort --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 Unbounded">
            {products.length} results for{" "}
            <span className="text-(--prim-color) font-bold">
              &quot;{query}&quot;
            </span>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:inline">
              Sort by:
            </span>
            <details className="relative group">
              <summary className="list-none flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:border-(--prim-color)">
                <ArrowUpDown className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  {sort === "newest" && "Newest Arrivals"}
                  {sort === "price_asc" && "Price: Low to High"}
                  {sort === "price_desc" && "Price: High to Low"}
                  {sort === "rating" && "Product Rating"}
                </span>
              </summary>

              {/* Centered logic: left-1/2 -translate-x-1/2 on mobile, right-0 on desktop */}
              <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 top-full mt-2 w-36 whitespace-nowrap bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                <SortOption
                  label="Newest Arrivals"
                  value="newest"
                  currentSort={sort}
                  query={query}
                />
                <SortOption
                  label="Price: Low to High"
                  value="price_asc"
                  currentSort={sort}
                  query={query}
                />
                <SortOption
                  label="Price: High to Low"
                  value="price_desc"
                  currentSort={sort}
                  query={query}
                />
                <SortOption
                  label="Product Rating"
                  value="rating"
                  currentSort={sort}
                  query={query}
                />
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* --- LEFT SIDEBAR (Filters) --- */}
          <div className="hidden md:block col-span-1 pr-4 space-y-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-gray-800">
                Customer Reviews
              </h3>
              <div className="flex flex-col gap-2">
                {[4, 3, 2, 1].map((star) => (
                  <Link
                    href={`/search?q=${query}&rating=${star}`}
                    key={star}
                    className="flex items-center hover:bg-red-50 p-1 rounded transition-colors group"
                  >
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < star ? "currentColor" : "none"}
                          className={
                            i < star ? "text-yellow-400" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2 group-hover:text-(--prim-color)">
                      & Up
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-gray-800">
                Price
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Under ₦10,000", min: 0, max: 10000 },
                  { label: "₦10,000 - ₦50,000", min: 10000, max: 50000 },
                  { label: "₦50,000 - ₦100,000", min: 50000, max: 100000 },
                  { label: "Over ₦100,000", min: 100000, max: 99999999 },
                ].map((range, idx) => (
                  <Link
                    key={idx}
                    href={`/search?q=${query}&minPrice=${range.min}&maxPrice=${range.max}`}
                    className="block text-sm text-gray-600 hover:text-(--prim-color) hover:font-medium py-1"
                  >
                    {range.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (Results) --- */}
          <div className="col-span-1 md:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  We couldn&apos;t find any matches.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try different keywords or check spelling.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => {
                  const isDeal =
                    product.oldPrice && product.price < product.oldPrice;
                  const discount =
                    isDeal && product.oldPrice
                      ? Math.round(
                          ((product.oldPrice - product.price) /
                            product.oldPrice) *
                            100,
                        )
                      : 0;

                  return (
                    <div
                      key={product._id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-6 group"
                    >
                      {/* Image Area */}
                      <div className="w-full sm:w-56 h-56 shrink-0 bg-gray-50 rounded-lg overflow-hidden relative">
                        <Link href={`/product/${product.slug}`}>
                          {product.image && product.image[0] ? (
                            <Image
                              src={urlFor(product.image[0]).url()}
                              alt={product.name}
                              fill
                              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </Link>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 flex flex-col Unbounded">
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="text-lg font-medium text-gray-900 line-clamp-2 hover:text-(--prim-color) transition-colors mb-2">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={
                                  i < (product.review || 4)
                                    ? "currentColor"
                                    : "none"
                                }
                                className={
                                  i < (product.review || 4)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({product.review || 0})
                          </span>
                        </div>

                        <div className="mb-2 Unbounded">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-semibold">₦</span>
                            <span className="text-2xl font-bold text-gray-900">
                              {product.price.toLocaleString()}
                            </span>
                          </div>
                          {isDeal && (
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <span className="line-through">
                                ₦{product.oldPrice?.toLocaleString()}
                              </span>
                              <span className="text-(--prim-color) bg-orange-50 px-1.5 py-0.5 rounded text-xs font-bold">
                                -{discount}%
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                            <Truck className="w-4 h-4" />
                            <span>Delivery by Family House SuperMarket</span>
                          </div>

                          {/* REPLACED THE BUTTON HERE WITH CLIENT COMPONENT */}
                          <div className="md:hidden">
                            <AddToCartButton product={product} />
                          </div>
                        </div>
                      </div>

                      {/* Desktop: Right CTA Column */}
                      <div className="hidden md:flex flex-col justify-center items-center w-48 pl-6 border-l border-gray-100">
                        <p className="text-lg font-bold text-green-600 mb-3">
                          In Stock
                        </p>
                        {/* REPLACED THE BUTTON HERE WITH CLIENT COMPONENT */}
                        <AddToCartButton product={product} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
