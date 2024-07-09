"use client";

import { useState, useEffect } from "react";
import { FaCheckCircle, FaCopy } from "react-icons/fa";
interface ShortenAddressProps {
  address: string;
  addressType: "tokenaddress" | "by" | "signature";
}

export const ShortenAddress: React.FC<ShortenAddressProps> = ({
  address,
  addressType,
}: {
  address: string | any;
  addressType: string | any;
}) => {
  const [copied, setCopied] = useState<Boolean>(false);

  if (!address) return "";

  const length = address.length;
  const prefix = address.slice(0, 6);
  const suffix = address.slice(length - 6, length);

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getLink = () => {
    switch (addressType) {
      case "tokenaddress":
      case "by":
        return `https://solscan.io/account/${address}`;
      case "signature":
        return `https://solscan.io/tx/${address}`;
      default:
        return "#";
    }
  };

  return (
    <div className="flex items-center">
      <a
        href={getLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-700 "
      >
        {`${prefix}....${suffix}`}
      </a>

      <button onClick={handleCopy} style={{ marginLeft: "8px" }}>
        {copied ? <FaCheckCircle className="text-green-600" /> : <FaCopy />}
      </button>
    </div>
  );
};

export const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState<number | any>(null);

  useEffect(() => {
    // Only execute on the client side
    if (typeof window !== "undefined") {
      const handleResize = () => setScreenWidth(window.innerWidth);

      setScreenWidth(window.innerWidth); // Set initial width
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return screenWidth;
};
