"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (

    <div className="fixed bottom-24 right-6 z-9990 group">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="
          flex items-center justify-center 
          w-14 h-14
          bg-(--prim-color) 
          text-white 
          rounded-full 
          shadow-lg 
          shadow-red-500/20
          transition-all duration-300 
          hover:scale-110 hover:-translate-y-1 hover:shadow-xl
          active:scale-95
          cursor-pointer
        "
        aria-label="Scroll to top"
      >
         <svg
            className="fill-white w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
          </svg>
      </button>
    </div>
  );
}
