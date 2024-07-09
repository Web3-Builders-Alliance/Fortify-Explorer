"use client";

import React from "react";
import { useExploreData } from "../utils/tokenUtils";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Searchbar = ({ className, updateState }: { className?: string, updateState: any }) => {
  const [inputPub, setInputPub] = useState<string>("");

  const { getNftsInWallet, getUserTokenAccounts, getUserTokenDelegated } =
    useExploreData({
      inputPub: inputPub,
    });

  const fetchData = async () => {
    if (!inputPub) return;

    try {
      const [getNft, getUserTokens, getDelegated]: any = await Promise.all([
        getNftsInWallet(inputPub),
        getUserTokenAccounts(inputPub),
        getUserTokenDelegated(inputPub),
      ]);

      const {
        nftNumber,
        nfts,
        unknownNft,
        unknownNftNum,
        validNftNum,
        validNft,
      } = getNft;

      const { revokeData, revokeNum } = getDelegated;

      const {
        tokenHoldings,
        strictLists,
        strictNum,
        allLists,
        allNum,
        unMatched,
        unMatchedNum,
      } = getUserTokens;

      // Calculate unknown tokens
      const mainListMints = nfts.map((item: any) => item.mintAddress);
      const mainTokenListMint = tokenHoldings.map((item: any) => item.mint);
      const firstList = mainTokenListMint.filter(
        (mint: any) => !mainListMints.includes(mint)
      );
      const nftMints = allLists.map((item: any) => item.address);
      const unknownTokens = firstList.filter(
        (mint: any) => !nftMints.includes(mint)
      );

      const generalData = {
        tokenHoldings,
        strictLists,
        strictNum,
        allLists,
        allNum,
        unMatched,
        unMatchedNum,
        revokeData,
        revokeNum,
        nftNumber,
        nfts,
        unknownNft,
        unknownNftNum,
        unknownToken: unknownTokens,
        unknownTokenNum: unknownTokens.length,
        validNftNum,
        validNft,
      };

      updateState(generalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPub(e.target.value);
  };

  return (
    <div
      className={`${className} relative bg-[#171b56]/60 flex items-center px-4 rounded-xl`}
    >
      <input
        required
        id="tokenAddress"
        name="tokenAddress"
        type="text"
        placeholder="Enter Wallet Address..."
        value={inputPub}
        onChange={handleInputChange}
        className="flex w-full h-9 lg:h-12 pl-5  border border-gray-300 rounded-sm focus:outline-none focus:border-black"
      />

      <button
        onClick={fetchData}
        className="absolute right-5 bg-[#000434] p-1 lg:p-3 rounded-md"
      >
        <FaSearch className="text-white text-xl" />
      </button>
    </div>
  );
};

export default Searchbar;


