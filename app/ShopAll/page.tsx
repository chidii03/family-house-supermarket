import { client } from "@/app/lib/sanity";
import  { getDeliveryEstimates }  from "@/app/utils/deliveryDate"; // Import our fixed logic
import ProductCard from "@/app/Components/ProductCard"; 
import { ShoppingBag, Truck, CheckCircle2 } from "lucide-react";

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

async function getData() {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    lessprice,
    slug,
    image
  }`;
  return await client.fetch(query);
}

export default async function ShopAll() {
  const products: Product[] = await getData();
  const estimates = getDeliveryEstimates(); // Use the fixed function

  return (
    <div className="bg-[#f7f8f4] min-h-screen pb-20">
      
      {/* --- HEADER & DELIVERY INFO --- */}
      <div className="bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            
            {/* Title */}
            <div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                Shop All
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>{products.length} Products Available</span>
              </p>
            </div>

            {/* Delivery Banner (Using Fixed Logic) */}
            <div className="bg-[#fff8df] rounded-lg p-3 flex items-center gap-3 border border-red-100">
              <div className="bg-white p-2 rounded-md shadow-sm text-(--prim-color)">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs md:text-sm">
               <p className="font-bold text-gray-900">
  Order within <span className="text-(--prim-color)">
    {estimates.countdownHours} hrs {estimates.countdownMins} mins
  </span>
</p>
                <p className="text-gray-500">
                  Get it by <span className="font-medium text-gray-700">{estimates.standard}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product._id} className="h-full">
               <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {/* Footer Note */}
        {products.length > 0 && (
            <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>You have reached the end of the list</span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

// Inside your ShopAll component...


// In your JSX...
