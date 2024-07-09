"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-white">
      {/* Illustration behind hero content */}

      <div>
        {/* Hero content */}
        <div className="flex flex-col lg:w-full gap-4 lg:gap-9  items-center lg:mx-6 pt-32 md:pt-32 lg:py-8 max-w-sm lg:max-w-full mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="flex flex-col  text-center justify-center items-center pb-12 lg:pt-24 md:pb-16">
            <h1
              className="text-3xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Safeguard
              <span className="bg-clip-text mx-2 leading-10 text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                Solana, 
              </span>
              one user at a time
            </h1>
            <div className="max-w-3xl mx-auto">
              <p
                className="flex text-justify text-sm py-4 md:text-xl md:leading-10 text-gray-600 mb-8 font-semibold"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Fortify your assets with intention, not just tech. Let us be
                your guardians as you navigate the solana planet, ensuring asset
                and user security along the journey
              </p>
              <div
                className="flex justify-center  gap-2"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <div>
                  <Link
                    href="/explorer"
                    className="py-3 px-8 rounded-lg text-white font-normal bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// className=""
