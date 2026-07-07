'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Loader2, ChevronRight } from 'lucide-react';
import { client } from '@/app/lib/sanity';
import Link from 'next/link';

// --- Types ---
type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

interface ProductSuggestion {
  _id: string;
  name: string;
  category: string;
  slug: { current: string };
  image: SanityImage[];
}

interface SearchBarProps {
  variant?: 'mobile' | 'desktop';
}

const SearchBar = ({ variant = 'desktop' }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, [pathname]);

    useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('search-active'); 
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('search-active');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('search-active');
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, [pathname]);

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // -- Debounce --
  const debounce = useCallback((func: (...args: unknown[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: unknown[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // -- Fetch Logic --
  const fetchSuggestions = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    
    const groqQuery = `*[_type == "product" && (
      name match "*${searchTerm}*" || 
      details match "*${searchTerm}*" ||
      category->title match "*${searchTerm}*" ||
      tags[] match "*${searchTerm}*"
    )][0...8] {
      _id,
      name,
      "slug": slug,
      "category": category->title
    }`;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any = await client.fetch(groqQuery);
      setSuggestions(results);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useRef(debounce((val) => fetchSuggestions(val as string), 300)).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);
    if (val.length > 0) {
      setIsOpen(true);
      debouncedSearch(val);
    } else {
      setIsOpen(false);
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for Focus (Optional) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300" />
      )}

      <div 
       ref={searchRef} 
        // Added sticky and high z-index
        className={`sticky top-0 z-50 w-full ${variant === 'mobile' ? 'py-2' : ''}`}
      >
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          
          {/* --- DESKTOP INPUT --- */}
          {variant === 'desktop' && (
             <div className={`hidden md:flex relative w-full items-center bg-white border-2 rounded-2xl overflow-hidden transition-colors shadow-sm
               ${isOpen ? 'border-(--prim-color)' : 'border-red-100'}
             `}>
                <div className="pl-4 text-gray-400">
                  {isLoading ? <Loader2 className="animate-spin w-5 h-5 text-(--prim-color)" /> : <Search className="w-5 h-5" />}
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  onFocus={() => setIsOpen(true)}
                  placeholder="Search for products..."
                  className="w-full py-3 px-3 text-gray-900 placeholder-gray-500 outline-none bg-transparent"
                  autoComplete="off"
                />
                 <button type="submit" className="bg-(--prim-color) hover:bg-(--prim-dark) text-white px-8 py-3 font-bold transition-all">
                  Search
                </button>
             </div>
          )}

          {/* --- MOBILE/IPAD UI (Strictly using your requested styles) --- */}
          {variant === 'mobile' && (
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={() => setIsOpen(true)}
                placeholder="Search..."
                className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-5 pr-12 text-sm outline-none placeholder-gray-400 focus:ring-1 focus:ring-(--prim-color)"
              />
              <div className="absolute right-4 top-2.5 text-gray-400 pointer-events-none">
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5 text-(--prim-color)" />
                ) : (
                  // Using Lucide Search icon instead of bootstrap class to be consistent
                  <Search className="w-5 h-5" />
                )}
              </div>
            </div>
          )}

          {/* --- SUGGESTIONS DROPDOWN --- */}
          {isOpen && suggestions.length > 0 && (
            <div className={`absolute left-0 right-0 bg-white shadow-xl z-50 overflow-hidden  mt-2 rounded-2xl border-t border-gray-100
               ${variant === 'desktop' ? 'rounded-b-2xl top-full' : 'rounded-2xl top-[110%] w-full'}
            `}>
              <ul className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {suggestions.map((product, index) => (
                  <li key={product._id} className="border-b border-gray-50 last:border-none">
                    <Link 
                      href={`/product/${product.slug.current}`}
                      className={`flex items-center justify-between px-4 py-3.5 hover:bg-red-50 transition-colors
                        ${index === activeIndex ? 'bg-gray-100' : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 truncate text-sm sm:text-base">
                            {product.name}
                          </span>
                          {product.category && (
                             <span className="text-xs text-(--prim-color)">in {product.category}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="bg-gray-50 p-2">
                 <button 
                  onClick={handleSearchSubmit} 
                  className="w-full text-center py-2 text-sm text-(--prim-color) font-bold hover:underline"
                 >
                   See all results for &quot;{query}&quot;
                 </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default SearchBar;
