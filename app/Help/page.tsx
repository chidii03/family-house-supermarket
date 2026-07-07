"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  Search,
  HelpCircle,
  Package,
  Truck,
  Shield,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  // Categories Data
  const categories = [
    { id: "all", name: "All Topics", icon: HelpCircle },
    { id: "ordering", name: "Ordering & Payment", icon: Package },
    { id: "shipping", name: "Shipping & Delivery", icon: Truck },
    { id: "returns", name: "Returns & Warranty", icon: Shield },
    { id: "products", name: "Product Information", icon: FileText },
  ];

  // FAQ Data
  const faqs = [
    {
      id: 1,
      question: "How long does delivery take within Lagos?",
      answer:
        "We offer same-day delivery for orders placed before 12 PM within Ikeja and mainland Lagos. For other parts of Lagos, delivery takes 24-48 hours. Express delivery options are available at checkout.",
      category: "shipping",
      popular: true,
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer:
        "We accept multiple payment methods: Bank transfers, credit/debit cards (Visa, MasterCard), Paystack, and cash on delivery for orders below ₦100,000. Corporate clients can request invoice-based payments.",
      category: "ordering",
      popular: true,
    },
    {
      id: 3,
      question: "Do you offer bulk discounts for corporate orders?",
      answer:
        "Yes! We offer special pricing for corporate and bulk orders. For orders above ₦50,000, you get up to 2% discount. Contact our corporate sales team at corporate@steveobizz@yahoo.com for customized quotes.",
      category: "ordering",
    },
    {
      id: 4,
      question: "What is your return policy?",
      answer:
        "We accept returns within 14 days of delivery for unused products in original packaging. Defective items are covered by manufacturer warranty and can be exchanged within 30 days. Some items like printers and electronics have specific return conditions.",
      category: "returns",
      popular: true,
    },
    {
      id: 5,
      question: "How do I track my order?",
      answer:
        'Once your order is shipped, you will receive a tracking number via SMS and email. You can track your order status on our website under "Track Orders Page" or contact our customer service for real-time updates.',
      category: "shipping",
    },
    {
      id: 6,
      question: "Do you ship outside Lagos?",
      answer:
        "Yes, we ship nationwide across Nigeria. Delivery times vary: 2-3 days for major cities, 3-5 days for other locations. Shipping costs are calculated at checkout based on location and order weight.",
      category: "shipping",
    },
    {
      id: 7,
      question: "Are your products genuine and authentic?",
      answer:
        "Absolutely! We are authorized distributors for all major brands we carry. Every product comes with manufacturer warranty and we guarantee 100% authenticity. Counterfeit products are not sold in our store.",
      category: "products",
      popular: true,
    },
    {
      id: 8,
      question: "Can I customize my order?",
      answer:
        "Yes, we offer customization services for corporate branding on items like notebooks, pens, and office supplies. Minimum order quantities apply. Contact our customization team on What's App +234 803 304 8352 for quotes and samples.",
      category: "products",
    },
    {
      id: 9,
      question: "What are your business hours?",
      answer:
        "Our store is open Monday, Tuesday, Wednesday, Friday from 7:00 AM to 7:00 PM, and Saturdays, Thurdays from 10:00 AM to 7:00 PM. Online orders can be placed 24/7 through our website.",
      category: "products", 
    },
    {
      id: 10,
      question: "How do I apply for a warranty claim?",
      answer:
        "For warranty claims, please contact us with your order number and photos/videos of the issue. Most products come with 1-year manufacturer warranty. We will guide you through the claim process and arrange repairs or replacement.",
      category: "returns",
    },
    {
      id: 11,
      question: "Do you offer installation services?",
      answer:
        "Yes, we offer installation and setup services for office furniture, printers, and electronics. This service is available for purchases above ₦50,000 within Lagos. Contact us to schedule installation.",
      category: "products",
    },
  ];

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleFeedback = (isHelpful: boolean, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the accordion when clicking the button
    if (isHelpful) {
      toast.success("Thanks for your feedback! We're glad we could help.", {});
    } else {
      toast.info(
        "Thanks for the feedback. We'll work on improving this answer.",
        {},
      );
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-red-950 py-24 border-b border-red-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-red-900 via-red-950 to-slate-900"></div>

        <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6 text-white">
            How Can We <span className="text-red-400">Help You?</span>
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto font-light">
            Find answers to common questions about delivery, payments, and
            returns.
          </p>
        </div>
      </div>

      {/* Search Bar (Floating) */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-2 flex items-center border border-gray-100">
          <Search className="w-6 h-6 text-gray-400 ml-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for answers (e.g. 'delivery', 'warranty')..."
            className="w-full px-4 py-4 text-lg outline-none text-gray-700 rounded-xl"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <h3 className="font-bold text-gray-900 px-4 mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                        activeCategory === cat.id
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Quick Contact Box in Sidebar */}
              <div className="mt-8 p-4 bg-red-50 rounded-xl">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  Can&apos;t find answer?
                </p>
                <p className="text-xs text-red-600 mb-3">
                  Our team is here to help.
                </p>
                <Link
                  href="/contact"
                  className="text-xs font-bold text-red-700 underline"
                >
                  Contact Support &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-9 space-y-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeCategory === "all"
                  ? "All Frequently Asked Questions"
                  : categories.find((c) => c.id === activeCategory)?.name}
              </h2>
              <span className="text-gray-500 text-sm">
                {filteredFaqs.length} results
              </span>
            </div>

            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`bg-white rounded-xl border transition-all duration-300 ${
                    openFaqId === faq.id
                      ? "border-primary-200 shadow-md ring-1 ring-primary-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left px-6 py-5 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {faq.popular && (
                          <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Popular
                          </span>
                        )}
                        <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                          {categories.find((c) => c.id === faq.category)?.name}
                        </span>
                      </div>
                      <h3
                        className={`text-lg font-semibold ${openFaqId === faq.id ? "text-primary-700" : "text-gray-900"}`}
                      >
                        {faq.question}
                      </h3>
                    </div>
                    {openFaqId === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-primary-500 shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                    )}
                  </button>

                  {openFaqId === faq.id && (
                    <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="h-px w-full bg-gray-100 mb-4"></div>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {faq.answer}
                      </p>

                      {/* Feedback Section */}
                      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">
                          Was this helpful?
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleFeedback(true, e)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-sm text-gray-600 hover:text-green-600 hover:border-green-200 hover:bg-green-50 transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" /> Yes
                          </button>
                          <button
                            onClick={(e) => handleFeedback(false, e)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-sm text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" /> No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No results found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse all categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-4 text-primary-600 font-medium hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Still Need Help Section */}
      <div className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still need support?
          </h2>
          <p className="text-gray-600 mb-10">
            Our support team is just a click away. We usually reply within a few
            hours during business days.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="tel:+2348033048352"
              className="group p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors border border-gray-100 hover:border-primary-100"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Call Us</h4>
              <p className="text-sm text-gray-500">+234 803 304 8352</p>
            </a>

            <a
              href="mailto:steveobizz@yahoo.com"
              className="group p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors border border-gray-100 hover:border-primary-100"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
              <p className="text-sm text-gray-500">familyhousesupermarket@gmail.com</p>
            </a>

            <a
              href="https://wa.me/2347044012151"
              className="group p-6 rounded-2xl bg-gray-50 hover:bg-green-50 transition-colors border border-gray-100 hover:border-green-100"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">WhatsApp</h4>
              <p className="text-sm text-gray-500">Chat Instantly</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
