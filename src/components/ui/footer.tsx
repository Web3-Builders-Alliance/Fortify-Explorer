import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/images/fortify-base.png";
export const footer = () => {
  return (
    <footer>
      <div className="w-full bg-[#000434] ">
        {/* Top area: Blocks */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6  border-gray-200 ">
          <div className="sm:flex justify-between ">
            {/* logo  */}
            <div className="flex justify-center">
              <Link href="/" className="" aria-label="Cruip">
                <Image
                  src={Logo}
                  alt="logo"
                  className="w-64 h-64 sm:w-72 sm:h-72 "
                />
              </Link>
            </div>
            <div className="flex justify-between  gap-8 pb-8 md:py-12 ">
              {/* 1st block */}
              <div className="flex items-center gap-20">
                <div className="sm:col-span-6 md:col-span-3 md:text-lg lg:col-span-2">
                  <h6 className="text-white font-medium mb-2">Products</h6>
                  <ul className="text-sm font-semibold md:text-lg">
                    <li className="mb-2">
                      <Link
                        href="/fortress"
                        className="text-white/60 hover:text-white transition duration-150 ease-in-out"
                      >
                        Fortress
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        href="/token-guard"
                        className="text-white/60 hover:text-white transition duration-150 ease-in-out"
                      >
                        Token Guard
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* 3rd block */}
                <div className="sm:col-span-6 md:col-span-3 md:text-lg lg:col-span-2">
                  <h6 className="text-white font-medium mb-2">Resources</h6>
                  <ul className="text-sm font-semibold md:text-lg">
                    <li className="mb-2">
                      <a
                        href="#0"
                        className="text-white/60 hover:text-white transition duration-150 ease-in-out"
                      >
                        Documentation
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        href="#0"
                        className="text-white/60 hover:text-white transition duration-150 ease-in-out"
                      >
                        Tutorials & Guides
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom area */}
          <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
            {/* Social as */}
            <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
              <li>
                <a
                  href="https://twitter.com/FortifySolana"
                  className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-8 h-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
                  </svg>
                </a>
              </li>
              <li className="ml-4">
                <a
                  href="https://github.com/Infinite-Legacy/Fortify"
                  className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                  aria-label="Github"
                >
                  <svg
                    className="w-8 h-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                  </svg>
                </a>
              </li>
            </ul>

            {/* Copyrights note */}
            <div className="text-sm text-white mr-4">
              &copy; Fortify Labs. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default footer;
