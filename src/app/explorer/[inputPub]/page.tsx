"use client";
import React, { useEffect, useState, useRef } from "react";
// import { useExploreContext } from "@/components/contexts/analysis";
import Searchbar from "@/components/ui/searchbar";
import Link from "next/link";
import { FaWallet, FaCopy, FaCheckCircle } from "react-icons/fa";
import { TbCurrencySolana } from "react-icons/tb";
import { trxColumns, tokensColumns } from "@/components/ui/columns";
import { DataTable, NftDataTable } from "@/components/ui/data-table";
import {
  tokensList,
  NftList,
  unknownList,
  trxList,
} from "@/components/utils/tokenUtils";
import { useScreenWidth } from "@/components/utils/addressUtil";

// text data for table here

const Analysis = ({
  updateState,
  analysisData,
}: {
  updateState: any;
  analysisData: any;
}) => {
  const {
    tokenHoldings,
    revokeData,
    nftNumber,
    nfts,
    strictLists,
    strictNum,
    allLists,
    allNum,
    unMatched,
    unMatchedNum,
    revokeNum,
    unknownNft,
    unknownNftNum,
    unknownToken,
    unknownTokenNum,
    validNftNum,
    validNft,
  } = analysisData;

  console.log(validNft);
  console.log(unknownToken);
  console.log(unknownNft);
  console.log("strict List:", strictLists);
  console.log("unverified:", unMatched);

  console.log(nfts);
  console.log(nftNumber);

  const tokenLength = tokenHoldings?.length;
  const [selectedData, setSelectedData] = useState<any[] | any>("");
  const [selection, setSelection] = useState<string>("Transactions");
  const [dataView, setDataView] = useState<boolean>(false);
  const [nftCount, setNftCount] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (nftNumber) {
      setNftCount(Number(nftNumber));
    }
  }, [nftNumber]);

  useEffect(() => {
    console.log("nftCount:", nftCount);
  }, [nftCount]);

  const handleClick = (data: any[] | any) => {
    setSelectedData(data);
    setDataView(true);
  };

  const toggleModal = () => {
    setDataView(!dataView);
  };

  const toggleSelection = (select: any) => {
    setSelection(select);
  };
  const shortenAddress = (address: string): string => {
    if (!address) return "";

    const length = address.length;
    const prefix = address.slice(0, 27);
    const suffix = address.slice(length - 4, length);

    return `${prefix}....${suffix}`;
  };

  const screenWidth = useScreenWidth();

  const addressInput = " Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o";

  const displayAddress =
    screenWidth > 600 ? addressInput : shortenAddress(addressInput);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressInput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const SELECTIONS = ["Transactions", "Tokens", "NFTs", "Unknown"];

  return (
    <main className="flex flex-col  w-full mt-24 lg:mt-36 gap-12 px-4 lg:px-10">
      <section className="flex flex-col lg:flex-row pb-6  py-6 lg:px-9  border-b border-white/20  ">
        <div className="flex flex-col gap-6 lg:gap-2 w-full px-2">
          <div className="flex items-center gap-4 divide-x-2 divide-white/20">
            <span>
              <FaWallet className="text-3xl lg:text-4xl" />
            </span>
            <h1 className="text-xl lg:text-3xl font-bold pl-4">Account</h1>
          </div>

          <div className="flex flex-col  lg:flex-row-reverse w-full  gap-6  lg:justify-between">
            <div>
              <Searchbar
                className="h-14 lg:h-20  w-72 lg:w-96"
                updateState={updateState}
              />
            </div>
            <h2 className="flex gap-4 text-xs  lg:text-base items-center font-semibold tracking-widest">
              <a
                href={`https://solscan.io/account/${addressInput}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:underline hover:text-blue-700"
              >
                {displayAddress}
              </a>
              <button onClick={handleCopy} style={{ marginLeft: "8px" }}>
                {copied ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaCopy />
                )}
              </button>
            </h2>
          </div>
        </div>
      </section>

      <section className="mt-10 mb-28 ">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 mt-6 lg:gap-x-8">
          {/* 1 */}
          <div className="flex flex-col gap-8">
            <div className="border items-center flex  justify-center text-center p-4 gap-2 bg-[#33365d]/30 flex-col sm:p-8 rounded-tl-3xl rounded-bl-3xl  shadow-2xl shadow-black/70  border-[#34d4f7]/60">
              <h2 className="text-xs font-bold"> SOL BALANCE</h2>
              <span className="flex flex-row items-center font-semibold gap-2">
                <TbCurrencySolana className="text-3xl text-green-600" />
                <h1 className="text-xl">2</h1>
              </span>
            </div>

            <div className="border items-center flex  flex-col justify-center text-center p-4 gap-2  bg-[#33365d]/30  sm:p-8 rounded-tl-3xl rounded-bl-3xl  shadow-2xl shadow-black/70  border-[#34d4f7]/60">
              <h2 className="text-xs font-bold"> TOKEN BALANCE</h2>
              <span className="flex flex-row items-center font-semibold gap-2">
                <h1 className="text-xl">$500</h1>
              </span>
            </div>

            <div className="border items-center flex  flex-col justify-center text-center p-4 gap-2  bg-[#33365d]/30  sm:p-8 rounded-tl-3xl rounded-bl-3xl  shadow-2xl shadow-black/70  border-[#34d4f7]/60">
              <h2 className="text-xs font-bold"> TOTAL NUMBER OF ITEMS</h2>
              <span className="flex flex-row items-center font-semibold gap-2">
                <h1 className="text-xl">{tokenLength}</h1>
              </span>
            </div>
          </div>

          {/* 2 */}
          <div className="border items-center flex  flex-col justify-center text-center p-4 gap-2  bg-[#33365d]/30  sm:p-8  shadow-black/70  shadow-2xl my-12 lg:my-0 border-[#34d4f7]/60">
            <h2 className="text-xs font-bold">Security Panel</h2>
            <span className="flex flex-row items-center font-semibold gap-2">
             
              <h1>Token Delegation: 2</h1>
            </span>
          </div>

          {/* 3 */}

          <div className="flex flex-col gap-8">
            <div className="border items-center flex  justify-center text-center p-4 gap-2 bg-[#33365d]/30 flex-col sm:p-8 rounded-tr-3xl rounded-br-3xl  shadow-2xl shadow-black/70  border-[#34d4f7]/60">
              <h2 className="text-xs font-bold"> Wallet Health Score</h2>
              <span className="flex flex-row items-center font-semibold gap-2">
              
                <h1 className="text-xl">76</h1>
              </span>
            </div>

            <div className="border items-center flex  flex-col justify-center text-center p-4 gap-2  bg-[#33365d]/30  sm:p-8 rounded-tr-3xl rounded-br-3xl shadow-black/70  shadow-2xl  border-[#34d4f7]/60">
              <h2 className="text-xs font-bold"> Verified Tokens</h2>
              <span className="flex flex-row items-center font-semibold gap-2">
                <h1 className="text-xl">67</h1>
              </span>
            </div>

            <div className="border items-center flex  flex-col justify-center text-center p-4 gap-2  bg-[#33365d]/30  sm:p-8 rounded-tr-3xl rounded-br-3xl shadow-black/70  shadow-2xl  border-[#34d4f7]/60">
              <h2 className="text-xs font-bold"> Verified NFTs</h2>
              <span className="flex flex-row items-center font-semibold gap-2">
                <h1 className="text-xl">12</h1>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="">
        <div className="flex gap-2 lg:gap-7 pb-14 px-2">
          {SELECTIONS.map((select, i) => (
            <button
              key={i}
              onClick={() => toggleSelection(select)}
              className={`rounded-2xl w-52  lg:w-44 font-bold text-[10px] sm:text-[13px] md:text-sm text-center border  border-t-4  border-b-4 lg:p-1 p-2  ${
                selection.includes(select)
                  ? "text-red-900 border border-red-900"
                  : " border-white/20"
              }`}
            >
              {select}
            </button>
          ))}
        </div>
        {selection === "Transactions" && (
          <div className=" bg-[#33365d]/10  sm:p-6 rounded-tl-3xl rounded-br-3xl  shadow-2xl  border-[#34d4f7]/60">
            <DataTable columns={trxColumns} data={trxList} />
          </div>
        )}

        {selection === "Tokens" && (
          <div className=" bg-[#33365d]/10  sm:p-6 rounded-tl-3xl rounded-br-3xl  shadow-2xl  border-[#34d4f7]/60">
            <DataTable columns={tokensColumns} data={tokensList} />
          </div>
        )}

        {selection === "NFTs" && (
          <div className=" bg-[#33365d]/10  sm:p-6 rounded-tl-3xl rounded-br-3xl  shadow-2xl  border-[#34d4f7]/60">
            {<NftDataTable data={validNft} />}
          </div>
        )}

        {selection === "Unknown" && (
          <div className=" bg-[#33365d]/10  sm:p-6 rounded-tl-3xl rounded-br-3xl  shadow-2xl  border-[#34d4f7]/60">
            <DataTable columns={tokensColumns} data={unknownList} />
          </div>
        )}
      </section>
    </main>
  );
};

export default Analysis;

// const SELECTIONS = ["Transactions", "Tokens", "NFTs", "Unknown Items"];

// <div className="flex flex-col  border-2 rounded-2xl md:px-12">
//       <div className="flex flex-col gap-20 w-full">
//         <div className=" max-w-6xl mx-auto  mt-12">
//           <h1 className="flex justify-center items-center text-xl md:text-3xl font-bold">
//             Fortress Scan
//           </h1>
//           <p className="flex justify-center items-center md:text-base text-gray-600 my-5 font-semibold text-xs ">
//             These are results from an onchain security analysis of the provided
//             public Key NFTNUMBER: {nftNumber}
//           </p>

//           <button onClick={() => updateState({})}>BACK</button>
//           {/*  items-center  */}
//           <ul className="flex flex-col gap-12 mt-6 sm:mt-20 w-full justify-center bg-[#000434] text-gray-200 px-2 py-12 rounded-2xl divide-y-2 divide-gray-600">
//             <li className="flex flex-col gap-4 pt-2 px-3">
//               <h2 className="flex md:text-xl font-black"> Tokens </h2>
//               <p className=" text-sm md:text-xl text-left font-medium">
//                 There are <span className="text-green-600">{tokenLength}</span>
//                 items in this address, which includes tokens, NFTs, and possibly
//                 unknown items.
//               </p>
//               <button
//                 onClick={() => handleClick(tokenHoldings)}
//                 className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
//               >
//                 Click to view
//               </button>
//             </li>

//             <li className="flex flex-col gap-4 pt-2 px-3">
//               <h2 className="flex text-xl font-black"> Verified Tokens </h2>
//               <p className="flex text-sm md:text-xl  font-medium">
//                 There are{" "}
//                 <span className="text-green-600 mx-1">{strictNum}</span>{" "}
//                 verified tokens in this address.
//               </p>
//               <button
//                 onClick={() => handleClick(strictLists)}
//                 className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
//               >
//                 Click to view
//               </button>
//             </li>

//             {/* Additional list items */}
//             <li className="flex flex-col gap-4 pt-2 px-3">
//               <h2 className="flex text-xl font-black"> Not Verified Tokens </h2>
//               <p className="text-start text-sm md:text-xl  font-medium">
//                 There are{" "}
//                 <span className="text-green-600 mx-1">{unMatchedNum}</span>{" "}
//                 unverified tokens in this address.
//               </p>
//               <button
//                 onClick={() => handleClick(unMatched)}
//                 className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
//               >
//                 Click to view
//               </button>
//             </li>
//             <li className="flex flex-col gap-4 pt-2 px-3">
//               <h2 className="flex text-xl font-black"> NFTs </h2>
//               <p className="text-start text-sm md:text-xl  font-medium">
//                 There are
//                 <span className="text-green-600 mx-1 ">{nftNumber}</span>
//                 NFTs in this wallet address. This includes both verified and
//                 scam NFTs.
//               </p>
//               <button
//                 // onClick={() => handleClick(nfts)}
//                 className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
//               >
//                 Click to view
//               </button>
//             </li>
//             {/* /// */}
//             <li className="flex flex-col gap-4 pt-2 px-3">
//               <h2 className="flex text-xl font-black"> Verified NFTs </h2>
//               <p className="text-start text-sm md:text-xl  font-medium">
//                 There are
//                 <span className="text-green-600 mx-1 ">{validNftNum}</span>
//                 Verified Nfts found in this wallet Address.
//               </p>
//               <button
//                 onClick={() => handleClick(validNft)}
//                 className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
//               >
//                 Click to view
//               </button>
//             </li>
//             {/* ///// */}
//             <li className="flex flex-col gap-4 pt-2 px-3">
//               <h2 className="flex text-xl font-black"> Unverifed NFTs </h2>
//               <p className="text-start  text-sm md:text-xl  font-medium">
//                 There are
//                 <span className="text-green-600 mx-1 ">{unknownNftNum}</span>
//                 unverifed NFTs found in this wallet Address. They might possibly
//                 be scam nfts
//               </p>
//               <button
//                 onClick={() => handleClick(unknownNft)}
//                 className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
//               >
//                 Click to view
//               </button>
//             </li>
//             {/* /// */}
//             <li className="flex flex-col gap-4 pt-2 px-3">
//               <h2 className="flex text-xl font-black"> Token Approval </h2>
//               <p className="text-start  text-sm md:text-xl  font-medium">
//                 There are
//                 <span className="text-green-600 mx-1 ">{revokeNum}</span>
//                 token approval found in this wallet Address.
//               </p>
//               <button
//                 onClick={() => handleClick(revokeData)}
//                 className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
//               >
//                 <Link href="/fortress/wallet">Click to view</Link>
//               </button>
//             </li>
//             {/* //////// */}

//             {/* //////// */}
//             <li className="flex flex-col gap-4 pt-2 px-3">
//               <h2 className="flex text-xl font-black"> Unknown Items </h2>
//               <p className="text-start  text-sm md:text-xl  font-medium">
//                 There are
//                 <span className="text-green-600 mx-1 ">{unknownTokenNum}</span>
//                 unidentified items found in this wallet Address. BE CAREFUL
//                 while interacting with them
//               </p>
//               <button
//                 onClick={() => handleClick(unknownToken)}
//                 className="font-medium hover:bg-red-900  bg-red-600 w-full md:w-1/5 p-2 rounded-lg"
//               >
//                 Click to view
//               </button>
//             </li>
//           </ul>
//         </div>
//         {/*  */}
//         {dataView && (
//           <div className="block fixed z-50  top-0 left-0 w-full  h-full overflow-auto ">
//             <div className="bg-[#000434] m-auto relative p-5 ">
//               <button
//                 className="flex absolute text-white right-4 cursor-pointer justify-end px-5 py-2 text-5xl font-normal "
//                 onClick={toggleModal}
//               >
//                 &times;
//               </button>
//               <div className="flex flex-col justify-center items-center gap-8 text-white text-sm md:text-lg mt-24 h-full mb-[460px] px-6 ">
//                 {selectedData.map((t: any, index: number) => (
//                   <div
//                     className="flex flex-row  items-center  max-w-4xl gap-4  border border-green-600 rounded-xl p-2 "
//                     key={index}
//                   >
//                     <img
//                       className="w-10 h-10 rounded-full"
//                       src={t.logoURI || t.imgage}
//                       alt="tokenImage"
//                     />
//                     <p>{t.name}</p>

//                     <p className="text-blue-600">

// use this for the new token system
//                       <a
//                         href={`https://solscan.io/token/${
//                           t.mint || t.mintAdddress
//                         }`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {shortenAddress(t.mint || t.mintAdddress)}
//                       </a>
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//         ;
//       </div>
//     </div>
