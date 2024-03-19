"use client";

import { useState, useEffect } from "react";

import React from "react";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/images/fortify-logo.png";
import MobileMenu from "./mobile-menu";

const Header = () => {
  const [top, setTop] = useState<boolean>(true);

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
              <Image src={Logo} alt="logo" className="w-28 h-28" />
            </Link>
          </div>

          <nav className="hidden md:flex md:grow">
            <ul className="flex gap-5 grow justify-end flex-wrap items-center">
              <li>
                <Link
                  href="/wallet-guard"
                  className="font-bold text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Token Guard
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="font-bold text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Fortress
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="btn-sm text-lg text-gray-200 bg-gray-900 hover:bg-gray-800 w-full my-2 py-3 px-4 rounded-lg"
                >
                  <span>Connect Wallet </span>
                </Link>
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
