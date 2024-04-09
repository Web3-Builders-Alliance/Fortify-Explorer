"use client";

import { FC, useState, useEffect } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";

import Logo2 from "../../../../public/images/newLogo2.png";

import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../mobile/fortress-mobile";

const Header: FC = ({}) => {
  const [top, setTop] = useState<boolean>(true);
  // wallet stuff
  // const { publicKey } = useWallet();

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
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out bg-white ${
        !top ? " backdrop-blur-sm shadow-lg" : ""
      }`}
    >
      <div className=" px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="mt-3">
            <Link href="/" className="block" aria-label="Cruip">
              <Image src={Logo2} alt="logo" className="w-16 h-16" />
            </Link>
          </div>

          <nav className="hidden md:flex md:grow">
            <ul className="flex gap-5 grow justify-end flex-wrap items-center">
              <li>
                <Link
                  href="/fortress"
                  className="font-bold text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Fortress
                </Link>
              </li>
              {/* ///////////////// */}
              <li>
                <Link
                  href="fortress/token-guard"
                  className="font-bold text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Token Guard
                </Link>
              </li>
              {/* //////////////// */}

              <li>
                <Link
                  href="/fortress"
                  className="font-bold text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Fortify Revoke
                </Link>
              </li>
              {/* /////////////// */}
              {/* <li>
                <Link
                  href="/fortress"
                  className="font-bold text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Token List
                </Link>
              </li> */}

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
