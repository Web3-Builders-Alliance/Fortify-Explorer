import React from "react";
import Link from "next/link";
import Image from "next/image";
import secure from "../../../public/images/secure.svg";


const Body = () => {
  return (
    <section className="relative bg-[#000434]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="flex flex-col gap-12 md:gap-4 pt-8 pb-24 md:pb-20">
          {/* Section header */}
          <div className="flex flex-col gap-12 max-w-3xl mx-auto text-center mt-12 pb-16 md:pb-16">
            <h1 className="text-white text-xl md:text-3xl font-bold  mb-6">
              Explore the solutions
            </h1>
            <p className="text-sm rounded-2xl shadow-2xl bg-gray-400/30 p-3 md:p-6 leading-8 lg:leading-10 md:text-xl font-semibold text-white">
              Fortify presents a comprehensive suite of solutions tailored to
              bolster security for users in the Solana ecosystem. We offer token
              analysis, wallet scans, connection revocation, dApp security
              checks, multisig support, MFA authentication, and heightened
              security awareness ensuring users remain well-informed and
              protected in their endeavors.
            </p>
          </div>

          {/* Hero image */}
          {/* <div
            className="flex justify-center md:my-12 pr-16 md:pr-0 h-52 md:h-72"
            data-aos="zoom-y-out"
            data-aos-delay="150"
          >
            <Image
              src={secure}
              alt="hero-img"
              className="max-w-sm mx-auto px-4 sm:px-6"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Body;
