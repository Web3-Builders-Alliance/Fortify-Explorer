"use client";

import { FC, useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { FaBarsStaggered, FaX } from "react-icons/fa6";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const MobileMenu = ({ top }: { top: any }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const trigger = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLDivElement>(null);

  const { publicKey } = useWallet();

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!mobileNav.current || !trigger.current) return;
      if (
        !mobileNavOpen ||
        mobileNav.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setMobileNavOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="flex md:hidden">
      {/* Hamburger button */}
      <button
        className="mt-1 mr-6 transition-transform transform duration-300 ease-in-out"
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className={mobileNavOpen ? "rotate-180" : ""}>
          {!mobileNavOpen ? (
            <FaBarsStaggered className={`w-6 h-6 text-white `} />
          ) : (
            <FaX className="w-5 h-5 text-white" />
          )}
        </span>
      </button>

      {/*Mobile navigation */}
      <div ref={mobileNav}>
        <Transition
          show={mobileNavOpen}
          as="nav"
          id="mobile-nav"
          className="absolute top-[73px] pt-20 h-screen pb-16 z-20 left-0 w-full  bg-[#000434]"
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ul className="flex flex-col w-full gap-4 justify-center items-center ">
            <li>
              <Link
                href="/explorer"
                className="font-bold text-gray-400 hover:text-gray-600 px-5 py-3 flex items-center transition duration-150 ease-in-out"
              >
                Explorer
              </Link>
            </li>
            {/* ///////////////// */}
            <li>
              <Link
                href="explorer/token-guard"
                className="font-bold text-gray-400 hover:text-gray-600 px-5 py-3 flex items-center transition duration-150 ease-in-out"
              >
                Token Guard
              </Link>
            </li>
            {/* //////////////// */}

            <li>
              <Link
                href="/fortress"
                className="font-bold text-gray-400 hover:text-gray-600 px-5 py-3 flex items-center transition duration-150 ease-in-out"
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

            <li className="flex mt-4">
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
        </Transition>
      </div>
    </div>
  );
};

export default MobileMenu;
