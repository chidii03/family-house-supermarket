"use client";
import { runFireWorks } from "@/app/lib/utils";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const pending = localStorage.getItem("payment_pending");
    if (!pending) {
      router.push("/");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsValid(true);
      localStorage.removeItem("payment_pending");
      localStorage.removeItem("cart");
      runFireWorks();
    }
  }, [router]);

  if (!isValid) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Polish */}
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-(--prim-color) via-black to-(--prim-color)"></div>
      
      <div className="max-w-2xl w-full text-center z-10 animate-in fade-in zoom-in duration-700">
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-green-500" size={48} />
          </div>
        </div>

        <h1 className="Unbounded text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">
          Packaged <span className="text-(--prim-color)">With Love.</span>
        </h1>
        <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto font-medium">
          Your order is confirmed and being prepared for delivery. You&apos;ll receive a WhatsApp update shortly.
        </p>

        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-12 shadow-sm">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <Package className="text-(--prim-color)" size={32} />
          </div>
          <div className="text-left flex-1">
            <h4 className="font-black uppercase tracking-widest text-xs text-gray-400 mb-1">What&apos;s Next?</h4>
            <p className="text-gray-800 font-bold leading-tight">Our team is verifying your items. Tracking will be active within 24 hours.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/track" className="group bg-(--prim-color) text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-(--prim-dark) transition-all active:scale-95 shadow-xl shadow-red-500/20">
            Track Your Package <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
          <Link href="/" className="px-10 py-5 border-2 border-red-100 text-(--prim-color) rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-red-50 transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
