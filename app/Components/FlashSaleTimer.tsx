"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export default function FlashSaleTimer() {
  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date();
    target.setHours(24, 0, 0, 0); // Midnight tonight

    const difference = target.getTime() - now.getTime();
    
    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null; 

  return (
    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-lg">
      <div className="p-2 bg-white/10 rounded-full animate-pulse">
        <Timer className="w-5 h-5 text-white" />
      </div>
      
      {/* Hours */}
      <div className="text-center">
        <span className="block text-2xl font-black text-white Unbounded leading-none">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase text-gray-300 font-bold tracking-wider">Hrs</span>
      </div>

      <span className="text-2xl font-bold text-white/50 -mt-3">:</span>

      {/* Minutes */}
      <div className="text-center">
        <span className="block text-2xl font-black text-white Unbounded leading-none">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase text-gray-300 font-bold tracking-wider">Mins</span>
      </div>

      <span className="text-2xl font-bold text-white/50 -mt-3">:</span>

      {/* Seconds */}
      <div className="text-center">
        <span className="block text-2xl font-black text-(--prim-color) Unbounded leading-none drop-shadow-md">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase text-gray-300 font-bold tracking-wider">Secs</span>
      </div>
    </div>
  );
}