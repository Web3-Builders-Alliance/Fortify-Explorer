"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
interface TokenHoldings {
  mint: string;
}

interface ScanResultsProps {
  tokenHoldings: TokenHoldings[] | any;
  revokeData: any;
  nfts: any[] | any;

  nftNumber: Number | any;
  strictLists: any;
  strictNum: Number | any;
  allLists: any;
  allNum: Number | any;
  unMatched: any;
  unMatchedNum: Number | any;
  revokeNum: Number | any;
  unknownNft: any;
  unknownToken: any;
  validNft: any;
  unknownNftNum: Number | any;
  unknownTokenNum: Number | any;
  validNftNum: Number | any;
}

const Scanresults: React.FC<ScanResultsProps> = ({
  tokenHoldings,
  revokeData,
  nfts,
  nftNumber,
  strictLists,
  strictNum,
  allLists,
  allNum,
  unMatched,
  unMatchedNum,
  revokeNum,
  unknownNft,
  unknownToken,
  validNft,
  unknownNftNum,
  unknownTokenNum,
  validNftNum,
}) => {
  const tokenLength = tokenHoldings.length;

  const [selectedData, setSelectedData] = useState<any[] | any>("");
  const [dataView, setDataView] = useState<boolean>(false);

  const handleClick = (data: any[] | any) => {
    setSelectedData(data);
    setDataView(true);
  };

  const toggleModal = () => {
    setDataView(!dataView);
  };

  const shortenAddress = (address: any) => {
    if (!address) return "";
    const length = address.length;
    const prefix = address.slice(0, 5);
    const suffix = address.slice(length - 5, length);
    return `${prefix}....${suffix}`;
  };



  return (
    <div className="flex flex-col  gap-y-2 border-2 rounded-2xl md:px-12 bg-white">
      <div className="flex flex-col gap-20 w-full">
        <div className=" max-w-6xl mx-auto  mt-12">
          <h1 className="flex justify-center items-center text-xl md:text-3xl font-bold">
            Fortress Scan
          </h1>
          <p className="flex justify-center items-center md:text-base text-gray-600 my-5 font-semibold text-xs ">
            These are results from an onchain security analysis of the provided
            public Key
          </p>
          {/*  items-center  */}
          <ul className="flex flex-col gap-12 mt-6 sm:mt-20 w-full justify-center bg-[#000434] text-gray-200 px-2 py-12 rounded-2xl divide-y-2 divide-gray-600">
            <li className="flex flex-col gap-4 pt-2 px-3">
              <h2 className="flex md:text-xl font-black"> Tokens </h2>
              <p className=" text-sm md:text-xl text-left font-medium">
                There are <span className="text-green-600">{tokenLength}</span>{" "}
                items in this address, which includes tokens, NFTs, and possibly
                unknown items.
              </p>
              <button
                onClick={() => handleClick(tokenHoldings)}
                className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
              >
                Click to view
              </button>
            </li>

            <li className="flex flex-col gap-4 pt-2 px-3">
              <h2 className="flex text-xl font-black"> Verified Tokens </h2>
              <p className="flex text-sm md:text-xl  font-medium">
                There are{" "}
                <span className="text-green-600 mx-1">{strictNum}</span>{" "}
                verified tokens in this address.
              </p>
              <button
                onClick={() => handleClick(strictLists)}
                className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
              >
                Click to view
              </button>
            </li>

            {/* Additional list items */}
            <li className="flex flex-col gap-4 pt-2 px-3">
              <h2 className="flex text-xl font-black"> Not Verified Tokens </h2>
              <p className="text-start text-sm md:text-xl  font-medium">
                There are{" "}
                <span className="text-green-600 mx-1">{unMatchedNum}</span>{" "}
                unverified tokens in this address.
              </p>
              <button
                onClick={() => handleClick(unMatched)}
                className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
              >
                Click to view
              </button>
            </li>
            <li className="flex flex-col gap-4 pt-2 px-3">
              <h2 className="flex text-xl font-black"> NFTs </h2>
              <p className="text-start text-sm md:text-xl  font-medium">
                There are
                <span className="text-green-600 mx-1 ">{nftNumber}</span>
                NFTs in this wallet address. This includes both verified and
                scam NFTs.
              </p>
              <button
                onClick={() => handleClick(nfts)}
                className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
              >
                Click to view
              </button>
            </li>
            {/* /// */}
            <li className="flex flex-col gap-4 pt-2 px-3">
              <h2 className="flex text-xl font-black"> Verified NFTs </h2>
              <p className="text-start text-sm md:text-xl  font-medium">
                There are
                <span className="text-green-600 mx-1 ">{validNftNum}</span>
                Verified Nfts found in this wallet Address.
              </p>
              <button
                onClick={() => handleClick(validNft)}
                className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
              >
                Click to view
              </button>
            </li>
            {/* ///// */}
            <li className="flex flex-col gap-4 pt-2 px-3">
              <h2 className="flex text-xl font-black"> Unverifed NFTs </h2>
              <p className="text-start  text-sm md:text-xl  font-medium">
                There are
                <span className="text-green-600 mx-1 ">{unknownNftNum}</span>
                unverifed NFTs found in this wallet Address. They might possibly
                be scam nfts
              </p>
              <button
                onClick={() => handleClick(unknownNft)}
                className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
              >
                Click to view
              </button>
            </li>
            {/* /// */}
            <li className="flex flex-col gap-4 pt-2 px-3">
              <h2 className="flex text-xl font-black"> Token Approval </h2>
              <p className="text-start  text-sm md:text-xl  font-medium">
                There are
                <span className="text-green-600 mx-1 ">{revokeNum}</span>
                token approval found in this wallet Address.
              </p>
              <button
                onClick={() => handleClick(revokeData)}
                className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
              >
                <Link href="/fortress/wallet">Click to view</Link>
              </button>
            </li>
            {/* //////// */}

            {/* //////// */}
            <li className="flex flex-col gap-4 pt-2 px-3">
              <h2 className="flex text-xl font-black"> Unknown Items </h2>
              <p className="text-start  text-sm md:text-xl  font-medium">
                There are
                <span className="text-green-600 mx-1 ">{unknownTokenNum}</span>
                unidentified items found in this wallet Address. BE CAREFUL
                while interacting with them
              </p>
              <button
                onClick={() => handleClick(unknownToken)}
                className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
              >
                Click to view
              </button>
            </li>
          </ul>
        </div>
        {/*  */}
        {dataView && (
          <div className="block fixed z-50  top-0 left-0 w-full  h-full overflow-auto ">
            <div className="bg-[#000434] m-auto relative p-5 ">
              <button
                className="flex absolute text-white right-4 cursor-pointer justify-end px-5 py-2 text-5xl font-normal "
                onClick={toggleModal}
              >
                &times;
              </button>
              <div className="flex flex-col justify-center items-center gap-8 text-white text-sm md:text-lg mt-24 h-full mb-[460px] px-6 ">
                {selectedData.map((t: any, index: number) => (
                  <div
                    className="flex flex-row  items-center  max-w-4xl gap-4  border border-green-600 rounded-xl p-2 "
                    key={index}
                  >
                    <img
                      className="w-10 h-10 rounded-full"
                      src={t.logoURI || t.imgage}
                      alt="tokenImage"
                    />
                    <p>{t.name}</p>

                    <p className="text-blue-600">
                      <a
                        href={`https://solscan.io/token/${
                          t.mint || t.mintAdddress
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {shortenAddress(t.mint || t.mintAdddress)}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        ;
      </div>
    </div>
  );
};

export default Scanresults;
