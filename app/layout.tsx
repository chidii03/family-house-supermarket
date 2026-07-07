import type { Metadata } from "next";
import "./globals.css";
import WhatsAppFloat from "@/app/Components/WhatsAppFloat";
import Navbar from "./Components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Components/Footer/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import { brand } from "@/supermarket.config";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  icons: {
    icon: "/favicon.ico",
    apple: brand.logo,
  },

  description: brand.description,
  keywords: [
    "Family House Supermarket",
    "Supermarket Ikotun",
    "Groceries Lagos",
    "Online Supermarket Nigeria",
    "Household Essentials Lagos",
    "Bakery Ikotun",
    "Frozen Foods Lagos",
    "Drinks and Beverages Nigeria",
  ],
  authors: [{ name: brand.name }],
  creator: brand.name,
  publisher: brand.name,
  
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: brand.url,
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.description,
    siteName: brand.name,
    images: [{ url: brand.logo, width: 1200, height: 630, alt: brand.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.description,
    images: [brand.logo],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">

        <Navbar />
        {children}
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <WhatsAppFloat />
        <ScrollToTop />
      </body>
    </html>
  );
}
