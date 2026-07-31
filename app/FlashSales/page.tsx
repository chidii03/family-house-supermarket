import { client } from "@/app/lib/sanity";
import ProductCard from "@/app/Components/ProductCard"; 
import FlashSaleTimer from "@/app/Components/FlashSaleTimer"; // Import the new timer
import { Tag } from "lucide-react";

export const dynamic = "force-dynamic";

// --- Types ---
type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

interface Product {
  _id: string;
  name: string;
  price: number;
  lessprice?: number;
  slug: { current: string };
  image: SanityImage[];
}

// Fetch products with discounts
async function getData(): Promise<Product[]> {
  const query = `*[_type == "product" && lessprice > price] | order(_createdAt desc) {
    _id,
    name,
    price,
    lessprice,
    slug,
    image
  }`;
  return await client.fetch<Product[]>(query);
}

export default async function FlashSales() {
  const products = await getData();

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* --- HERO BANNER --- */}
      <div className="relative bg-black text-white overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-(--prim-color) opacity-20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-75 h-75 bg-blue-600 opacity-10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Text Content */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--prim-color)/20 border border-(--prim-color)/30 text-(--prim-color) mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--prim-color) opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-(--prim-color)"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">Live Offers</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black Unbounded italic tracking-tighter text-white mb-4">
                FLASH <span className="text-transparent bg-clip-text bg-linear-to-r from-(--prim-color) to-orange-400">SALE</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-md mx-auto md:mx-0">
                Exclusive deals on food stuffs and household essentials. Prices reset when the timer hits zero.
              </p>
            </div>

            {/* The Timer Component */}
            <div>
              <FlashSaleTimer />
            </div>
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product._id} className="h-full">
               <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-8">
            <Tag className="w-12 h-12 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 Unbounded">No Deals Right Now</h2>
            <p className="text-gray-500 text-sm">Our flash sales move fast. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}