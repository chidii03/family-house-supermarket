// app/terms/page.tsx
import Link from "next/link";
import { FileText, ShoppingBag, Shield, CreditCard, AlertTriangle, Users, Globe, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata = { title: "Terms & Conditions | Family House Supermarket" };

const Section = ({ icon: Icon, number, title, children }: {
  icon: LucideIcon; number: string; title: string; children: React.ReactNode;
}) => (
  <div className="mb-12 scroll-mt-24" id={`section-${number}`}>
    <div className="flex items-start gap-4 mb-5">
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#dc2626] text-white flex items-center justify-center font-black text-sm">
        {number}
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Icon size={20} className="text-[#dc2626] shrink-0" />
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{title}</h2>
      </div>
    </div>
    <div className="ml-16 text-gray-600 leading-relaxed space-y-3">{children}</div>
    <div className="mt-6 border-b border-gray-100" />
  </div>
);

export default function TermsAndConditions() {
  const toc = [
    { n: "01", label: "Acceptance of Terms" },
    { n: "02", label: "Use of Our Store" },
    { n: "03", label: "Products & Pricing" },
    { n: "04", label: "Orders & Payment" },
    { n: "05", label: "Shipping & Delivery" },
    { n: "06", label: "Returns & Refunds" },
    { n: "07", label: "Intellectual Property" },
    { n: "08", label: "Limitation of Liability" },
    { n: "09", label: "Governing Law" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-linear-to-br from-[#dc2626] to-[#dc2626] text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">Terms & Conditions</h1>
            </div>
          </div>
          <p className="text-white/75 max-w-xl leading-relaxed">
            Please read these terms carefully before using our website or placing an order. By shopping with us, you agree to be bound by these terms.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col lg:flex-row gap-12">
        {/* Sidebar TOC */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Contents</p>
            <nav className="space-y-1">
              {toc.map((item) => (
                <a key={item.n} href={`#section-${item.n}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-[#4b70f5]/10 hover:text-[#4b70f5] transition-all group">
                  <span className="text-[10px] font-black text-gray-300 group-hover:text-[#4b70f5]/40 w-6">{item.n}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          <Section icon={FileText} number="01" title="Acceptance of Terms">
            <p>By accessing or purchasing from <strong className="text-gray-900">familyhousesupermarket.com</strong> (&quot;the Store&quot;, &quot;we&quot;, &quot;us&quot;), you confirm that you are at least 18 years of age, have read and understood these Terms, and agree to be bound by them.</p>
            <p>We reserve the right to update these Terms at any time. Continued use of the Store after changes constitutes acceptance of the revised Terms. The date of the most recent update is noted above.</p>
          </Section>

          <Section icon={Globe} number="02" title="Use of Our Store">
            <p>You agree to use the Store only for lawful purposes and in a manner that does not infringe the rights of others. You must not:</p>
            <ul className="space-y-2 mt-2">
              {[
                "Use automated bots, scrapers, or tools to access or copy Store content",
                "Attempt to gain unauthorised access to any part of the Store",
                "Submit false, misleading, or fraudulent information",
                "Use the Store to transmit unsolicited commercial communications",
                "Engage in any activity that disrupts or damages the Store's functionality",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#4b70f5] font-bold mt-0.5">—</span> {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={ShoppingBag} number="03" title="Products & Pricing">
            <p>All products are subject to availability. We reserve the right to discontinue any product at any time without notice.</p>
            <p>Prices are displayed in <strong className="text-gray-900">Nigerian Naira (₦)</strong> and include applicable taxes unless stated otherwise. We strive for accuracy but reserve the right to correct pricing errors. If a pricing error affects your order, we will notify you before processing payment.</p>
            <div className="bg-[#4b70f5]/5 border border-[#4b70f5]/20 rounded-xl p-4 mt-4">
              <p className="text-sm"><strong className="text-[#4b70f5]">Note:</strong> Product images are for illustrative purposes and may differ slightly from the physical item. Colour accuracy may vary depending on your screen settings.</p>
            </div>
          </Section>

          <Section icon={CreditCard} number="04" title="Orders & Payment">
            <p>Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order at our discretion, including for reasons of stock unavailability, pricing errors, or suspected fraudulent activity.</p>
            <p>All payments are processed securely through <strong className="text-gray-900">Paystack</strong>. We do not store your card details. By completing payment, you confirm the billing information provided is accurate and that you are authorised to use the payment method.</p>
            <p>You will receive an order confirmation email with your Order ID after successful payment. This does not constitute our acceptance of your order — acceptance occurs when we dispatch your item.</p>
          </Section>

          <Section icon={ShoppingBag} number="05" title="Shipping & Delivery">
            <p>Delivery times are estimates only and not guaranteed. We are not liable for delays caused by couriers, adverse weather, public holidays, or other factors beyond our control.</p>
            <ul className="space-y-2 mt-2">
              {[
                "Standard delivery: 3–7 business days (within Nigeria)",
                "Express delivery: 1–3 business days (select locations)",
                "Risk of loss passes to you upon delivery to the address provided",
                "Incorrect addresses provided by the customer may incur re-delivery charges",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#4b70f5] font-bold mt-0.5">—</span> {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Shield} number="06" title="Returns & Refunds">
            <p>Returns are governed by our <Link href="/return-policy" className="text-[#4b70f5] font-semibold underline hover:text-[#2952e3]">Return Policy</Link>, which forms part of these Terms. By purchasing, you agree to the conditions set out therein.</p>
            <p>Refunds, where applicable, will be processed to the original payment method within 5–10 business days of our receipt and inspection of the returned item.</p>
          </Section>

          <Section icon={Users} number="07" title="Intellectual Property">
            <p>All content on this Store — including text, images, logos, product descriptions, and design — is the exclusive property of Steve O Bizz Store or its licensors and is protected by Nigerian and international intellectual property laws.</p>
            <p>You may not reproduce, distribute, modify, or create derivative works from any Store content without our prior written permission.</p>
          </Section>

          <Section icon={AlertTriangle} number="08" title="Limitation of Liability">
            <p>To the fullest extent permitted by law, Family House SuperMarket shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Store or products purchased from it.</p>
            <p>Our total liability for any claim arising from a purchase shall not exceed the amount you paid for the item in question.</p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-3">
              <p className="text-sm text-amber-800">Nothing in these Terms excludes or limits liability for death or personal injury caused by our negligence, or for fraud or fraudulent misrepresentation.</p>
            </div>
          </Section>

          <Section icon={Scale} number="09" title="Governing Law">
            <p>These Terms are governed by and construed in accordance with the laws of the <strong className="text-gray-900">Federal Republic of Nigeria</strong>. Any disputes shall be subject to the exclusive jurisdiction of the Nigerian courts.</p>
            <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
          </Section>
        </main>
      </div>
    </div>
  );
}