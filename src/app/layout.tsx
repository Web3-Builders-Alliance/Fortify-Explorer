import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Footer from "@/components/ui/footer";
import WalletContextProvider from "@/components/contexts/ClientWalletProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Fortify",
  description: "Ensuring safer interactions with solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-inter antialiased bg-[#000434] text-gray-400 tracking-tight`}
      >
        <WalletContextProvider>
          <div className="flex flex-col justify-between min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
            {children}
            <Footer />
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
