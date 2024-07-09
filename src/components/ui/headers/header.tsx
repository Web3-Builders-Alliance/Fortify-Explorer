"use client";

import React, { FC, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../mobile/mobile-menu";


const Header: FC = ({}) => {
  const [top, setTop] = useState<boolean>(true);
  // wallet stuff
  const { publicKey } = useWallet();

  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top ? "bg-white backdrop-blur-sm shadow-lg" : ""
      }`}
    >
      <div className=" px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="mt-3">
            <Link href="/" className="block" aria-label="Cruip">
              <Image
                src="/images/newLogo2.png"
                alt="logo"
                width="200"
                height="200"
                className="w-16 h-16"
              />
            </Link>
          </div>

          <nav className="hidden md:flex md:grow">
            <ul className="flex gap-5 grow justify-end flex-wrap items-center">
              <li>
                <Link
                  href="/explorer"
                  className="font-bold text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Explorer
                </Link>
              </li>

              <li>
                <div className="flex-none">
                  <WalletMultiButton
                    className="flex rounded-3xl"
                    style={{
                      backgroundColor: "#000434",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </div>
              </li>
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
