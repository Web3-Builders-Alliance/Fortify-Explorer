import React from "react";
import {
  FaBriefcaseMedical,
  FaClipboardCheck,
  FaMicroscope,
  FaMortarPestle,
  FaBookOpenReader,
  FaUserShield,
} from "react-icons/fa6";

export const Extended = () => {
  return (
    <section className="relative bg-white">
   
      <div
        className="absolute inset-0 top-1/2 md:mt-24 lg:mt-0 bg-[#000434] pointer-events-none"
        aria-hidden="true"
      ></div>
      <div className="absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="text-2xl font-bold mb-4 mt-12">Why Use Fortify?</h2>
            <p className="text-sm md:text-xl font-medium text-gray-600 py-8">
              The Blockchain and Cryptocurrency realm has been a hotbed of
              innovation, yet it is also a playground full of risks and hacks.
              But fear not, With extra layer of security, users can spot threats
              in the blink of an eye
            </p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
            {/* 1st item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <span className="flex justify-center p-4 text-xl  rounded-full bg-[#000434] text-white -mt-1 mb-2">
                <FaBriefcaseMedical />
              </span>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Wallet Health
              </h4>
              <p className="text-gray-600 text-center text-sm md:text-xl  py-3">
                Ensure 90% wallet health through weekly scans for maximum
                assurance
              </p>
            </div>


            {/*  */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <span className="flex justify-center p-4 text-xl  rounded-full bg-[#000434] text-white -mt-1 mb-2">
                <FaBriefcaseMedical />
              </span>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Explorer
              </h4>
              <p className="text-sm md:text-xl text-gray-600 text-center">
              Check your wallets using our explorer and get all the security details you need 
              </p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <span className="flex justify-center p-4 text-xl  rounded-full bg-[#000434] text-white -mt-1 mb-2">
                <FaClipboardCheck />
              </span>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Token Information
              </h4>
              <p className="text-sm md:text-xl text-gray-600 py-3 text-center">
                Degen empowered with additional token insights for informed
                decisions
              </p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <span className="flex justify-center p-4 text-xl  rounded-full bg-[#000434] text-white -mt-1 mb-2">
                <FaMicroscope />
              </span>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Find & Revoke
              </h4>
              <p className="text-sm md:text-xl text-gray-600 text-center">
                Perform a scan and revoke unneccessary dapp connection with your
                wallet
              </p>
            </div>

            {/* 4th item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <span className="flex justify-center p-4 text-xl  rounded-full bg-[#000434] text-white -mt-1 mb-2">
                <FaMortarPestle />
              </span>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                A Perfect Mix
              </h4>
              <p className="text-sm md:text-xl text-gray-600 text-center">
                Fortress, our beta integration with Solana wallets, provides
                expanded security options.
              </p>
            </div>

            {/* 5th item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <span className="flex justify-center p-4 text-xl  rounded-full bg-[#000434] text-white -mt-1 mb-2">
                <FaBookOpenReader />
              </span>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Educate Users
              </h4>
              <p className="text-sm md:text-xl text-gray-600 text-center">
                It is time, that we make ample efforts to educate and make moves
                to fortify our assets
              </p>
            </div>

            {/* 6th item */}
            
          </div>
        </div>
      </div>
    </section>
  );
};
