"use client";

import { useState } from "react";
import { CheckCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "react-toastify";
import { brand } from "@/supermarket.config";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!");
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        toast.error(data.error || "Failed to send message.");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="relative overflow-hidden bg-black py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(248,196,0,0.44),transparent_30%),linear-gradient(135deg,#101010,#d71920)]" />
        <div className="relative max-w-360 mx-auto px-[5%] lg:px-[8%]">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-(--accent-color)">Contact</span>
          <h1 className="mt-4 text-4xl md:text-6xl font-black Unbounded">We are ready to help.</h1>
          <p className="mt-5 max-w-2xl text-white/80">
            Visit Family House Supermarket in Ikotun, call us, send a message or chat with us on WhatsApp.
          </p>
        </div>
      </section>

      <section className="max-w-360 mx-auto grid gap-10 px-[5%] lg:px-[8%] py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          {[
            { icon: Phone, label: "WhatsApp / Call", value: brand.phone, href: `tel:${brand.phoneInternational}` },
            { icon: Mail, label: "Email", value: brand.email, href: `mailto:${brand.email}` },
            { icon: MapPin, label: "Address", value: brand.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address)}` },
          ].map((item) => (
            <a key={item.label} href={item.href} target={item.label === "Address" ? "_blank" : undefined} rel={item.label === "Address" ? "noopener noreferrer" : undefined} className="flex gap-5 rounded-2xl border border-red-100 bg-[#fffaf0] p-6 hover:shadow-lg">
              <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-(--prim-color) text-white">
                <item.icon />
              </span>
              <span>
                <span className="block text-xs font-black uppercase tracking-widest text-gray-500">{item.label}</span>
                <span className="mt-1 block font-bold text-gray-950">{item.value}</span>
              </span>
            </a>
          ))}

          <a
            href={`https://wa.me/${brand.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl bg-black p-6 text-center text-sm font-black uppercase tracking-widest text-white hover:bg-(--prim-color)"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="rounded-3xl bg-black p-6 md:p-10 text-white">
          {isSubmitted ? (
            <div className="flex min-h-96 flex-col items-center justify-center text-center">
              <CheckCircle className="mb-6 h-20 w-20 text-(--accent-color)" />
              <h2 className="text-2xl font-black Unbounded">Message Sent</h2>
              <button onClick={() => setIsSubmitted(false)} className="mt-5 text-(--accent-color) underline">
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="Full name" className="rounded-xl border border-white/10 bg-white/10 p-4 outline-none focus:border-(--accent-color)" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email address" className="rounded-xl border border-white/10 bg-white/10 p-4 outline-none focus:border-(--accent-color)" />
                <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone number" className="rounded-xl border border-white/10 bg-white/10 p-4 outline-none focus:border-(--accent-color) md:col-span-2" />
              </div>
              <textarea name="message" rows={5} value={formData.message} onChange={handleChange} required placeholder="How can we help?" className="w-full rounded-xl border border-white/10 bg-white/10 p-4 outline-none focus:border-(--accent-color)" />
              <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--prim-color) py-4 font-black uppercase tracking-widest text-white hover:bg-(--prim-dark) disabled:opacity-70">
                {isSubmitting ? "Sending..." : "Send Message"} <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
