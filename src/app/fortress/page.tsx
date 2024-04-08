"use client";

import React, { FC, useState, useEffect, useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, Connection } from "@solana/web3.js";
import {
  getTokensMetadata,
  getAllNfts,
  getTokenStatus,
  getAllTokenStatus,
} from "@/components/utils/getTokensMetadata";
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { debounce } from "lodash";
import Scanresults from "@/components/ui/scanresults";
import { FaSearchDollar, FaFighterJet, FaBatteryFull } from "react-icons/fa";
import ApexCharts from "apexcharts";

import dynamic from "next/dynamic";

// Use dynamic import to load the component only on the client-side
const DynamicArc = dynamic(() => import("../../components/arc"), {
  ssr: false,
});

interface RadialBarChartProps {
  score: number;
}

const Fortress = () => {
  const [loading, setLoading] = useState(false);
  const [inputPub, setInputPub] = useState<string>("");
  const [tokenFetched, setTokenFetched] = useState<boolean>(false);
  const [tokenAccounts, setTokenAccounts] = useState<any[] | any>([]);
  const [nftInAccounts, setNftInAccounts] = useState<any[] | any>([]);
  const [nftNumber, setNftNumber] = useState<Number | any>(0);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [userTokenDelegated, setUserTokenDelegated] = useState<any>("");
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [strictLists, setStrictLists] = useState<any>("");
  const [strictNum, setStrictNum] = useState<number | any>(0);
  const [allLists, setAllLists] = useState<any[] | any>([]);
  const [allNum, setAllNum] = useState<number | any>(0);
  const [unmatched, setUnmatched] = useState<any>("");
  const [unmatchedNum, setunmatchedNum] = useState<number | any>(0);
  const [revokeNum, setRevokeNum] = useState<number | any>(0);

  const [walletHealth, setWalletHealth] = useState<number | any>(0);
  const [validNft, setValidNft] = useState<any[] | any>([]);
  const [validNftNum, setValidNftNum] = useState<number | any>(0);
  const [unknownNft, setUnknownNft] = useState<any[] | any>([]);
  const [unknownNftNum, setUnknownNftNum] = useState<number | any>(0);
  const [unknownToken, setUnknownToken] = useState<number | any>(0);
  const [unknownTokenNum, setUnknownTokenNum] = useState<number | any>(0);
  const [walletStatus, setWalletStatus] = useState<string>("");

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const { connection } = useConnection();

  const getUserTokenDelegated = async () => {
    if (!inputPub) {
      setUserTokenDelegated([]);
      return;
    }
    const publicKey = new PublicKey(inputPub);

    setIsFetched(false);

    try {
      const { value: splAccounts } = await connection.getTokenAccountsByOwner(
        publicKey,
        {
          programId: new PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
        },
        "processed"
      );

      const tokenDelegated = splAccounts
        .filter((m) => {
          const data = m.account.data;
          const info = AccountLayout.decode(data);
          const delegateOption = info.delegateOption;
          return delegateOption != 0;
        })
        .map((m) => {
          const data = m.account.data;
          const info = AccountLayout.decode(data);
          const mintAdddress = new PublicKey(info.mint).toBase58();
          const tokenAccountaddress = m.pubkey.toBase58();
          return { tokenAccountaddress, mintAdddress };
        });

      const tokenDelegatedMetadata = await getTokensMetadata(
        tokenDelegated,
        connection
      );

      setRevokeNum(tokenDelegatedMetadata.length);

      setUserTokenDelegated(tokenDelegatedMetadata);

      setIsFetched(true);
    } catch (error) {
      console.error("Error fetching delegated tokens:", error);
    }
  };

  const getUserTokenAccounts = async () => {
    try {
      const publickey: PublicKey = new PublicKey(inputPub);
      setTokenFetched(false);

      const { value: splTokens } = await connection.getTokenAccountsByOwner(
        publickey,
        {
          programId: new PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
        },
        "processed"
      );

      const tokensFromAccount = splTokens.map((t) => {
        const data = t.account.data;
        const info = AccountLayout.decode(data);
        // const amount = info.nu
        const mintAdddress = new PublicKey(info.mint).toBase58();
        const tokenAccountaddress = t.pubkey.toBase58();
        return { tokenAccountaddress, mintAdddress };
      });
      const accountTokens: any = await getTokensMetadata(
        tokensFromAccount,
        connection
      );

      const tokenMintData = accountTokens.map((t: any) => t.mint);

      const strictList = await getTokenStatus(tokenMintData);
      const allList = await getAllTokenStatus(tokenMintData);

      const remainingToken = allList.filter((allItem: any) => {
        return !strictList.some(
          (strictItem: any) => strictItem.address === allItem.address
        );
      });

      setTokenAccounts(accountTokens);
      setStrictLists(strictList);
      setStrictNum(strictList.length);
      setAllLists(allList);
      setAllNum(allList.length);
      setUnmatched(remainingToken);
      setunmatchedNum(remainingToken.length);
      setTokenFetched(true);
      setIsFetched(true);
    } catch (error) {
      console.error("Error Fetching Tokens:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getNftsInWallet = async (inputPub: string) => {
    try {
      const nftInWallet = await getAllNfts(inputPub);

      const nftArray = nftInWallet.nfts;
      const nftNumberInWallet = nftArray.length;

      if (!Array.isArray(nftArray)) {
        console.error("nftArray is not an array.");
        return; // or handle the error accordingly
      }

      const verifiedNfts = nftArray.filter((item: any) => {
        return item.collection && item.collection.verified === true;
      });

      const unVerifiedNfts = nftArray.filter((item: any) => {
        return (
          !item.collection ||
          (item.collection && item.collection.verified !== true)
        );
      });

      setValidNft(verifiedNfts);

      setNftInAccounts(nftArray);

      setNftNumber(nftNumberInWallet);
      setValidNftNum(verifiedNfts.length);
      setUnknownNftNum(unVerifiedNfts.length);
      setUnknownNft(unVerifiedNfts);

      return nftArray;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return [];
    }
  };

  useEffect(() => {
    const mainListMints = nftInAccounts.map((item: any) => item.mintAddress);

    const mainTokenListMint = tokenAccounts.map((item: any) => item.mint);

    const firstList = mainTokenListMint.filter(
      (mint: any) => !mainListMints.includes(mint)
    );

    const nftMints = allLists.map((item: any) => item.address);

    const unknownTokens = firstList.filter(
      (mint: any) => !nftMints.includes(mint)
    );

    setUnknownToken(unknownTokens);
    setUnknownTokenNum(unknownTokens.length);
  }, [allLists, nftInAccounts, tokenAccounts]);

  const tokenLength: number = tokenAccounts.length;
  // calculation  block for the wallet heakth////////////////////////////////
  useEffect(() => {
    // Ensure tokenAccounts has been fetched
    if (
      tokenAccounts.length === 0 ||
      typeof tokenLength !== "number" ||
      typeof revokeNum !== "number" ||
      typeof strictNum !== "number" ||
      typeof allNum !== "number" ||
      typeof validNftNum !== "number" ||
      typeof nftNumber !== "number" ||
      typeof unknownTokenNum !== "number" ||
      typeof unknownNftNum !== "number"
    ) {
      return;
    }

    // Calculate revoke points
    const unrevoked = tokenLength - revokeNum;
    const revokePoints = tokenLength === 0 ? 0 : (unrevoked / tokenLength) * 60;

    // Calculate token part scores
    const groupToken = allNum === 0 ? 0 : (strictNum / allNum) * 30;
    const groupNft = nftNumber === 0 ? 0 : (validNftNum / nftNumber) * 10;

    // Calculate unknown part score
    const unknownPart =
      tokenLength === 0 || nftNumber === 0
        ? 0
        : (unknownTokenNum / tokenLength + unknownNftNum / nftNumber) * 15;

    // Calculate token percentile
    const tokenPercentile = groupToken + groupNft - unknownPart;

    // Calculate total wallet health score
    const totalWallet = revokePoints + tokenPercentile;

    const finalScore = Math.round(totalWallet);

    const getStatus = (score: any) => {
      if (score >= 0 && score <= 15) return "Critical";
      if (score >= 16 && score <= 35) return "Unsafe";
      if (score >= 36 && score <= 45) return "Vulnerable";
      if (score >= 46 && score <= 60) return "Degen but Okay";
      if (score >= 61 && score <= 75) return "Stable";
      if (score >= 76 && score <= 85) return "Healthy";
      if (score >= 86 && score <= 93) return "Fortified";
      if (score >= 94 && score <= 100) return "Excellent";
      return "Unknown";
    };

    setWalletStatus(getStatus(finalScore));

    // Set wallet health state
    setWalletHealth(finalScore);
  }, [
    tokenAccounts,
    tokenLength,
    revokeNum,
    strictNum,
    allNum,
    validNftNum,
    nftNumber,
    unknownTokenNum,
    unknownNftNum,
  ]);

  const handleSubmit = async () => {
    if (!inputPub) {
      setError(true);
      setShowErrorModal(true);
      return;
    }
    setLoading(true);

    getUserTokenDelegated();

    getUserTokenAccounts();

    await getNftsInWallet(inputPub);
  };

  const showModalFunction = async () => {
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPub(e.target.value);
    setWalletHealth(0);
  };

  useEffect(() => {
    if (isFetched && tokenFetched) {
      const timeOutLoader = setTimeout(() => {
        setLoading(false);
      }, 4000);

      return () => clearTimeout(timeOutLoader);
    }
  }, [isFetched, tokenFetched]);

  useEffect(() => {
    if (isFetched && tokenFetched) {
      const timeOutLoader = setTimeout(() => {
        setIsFetched(false);
        setTokenFetched(false);
      }, 14000);

      return () => clearTimeout(timeOutLoader);
    }
  }, [isFetched, tokenFetched]);

  useEffect(() => {
    if (error) {
      // setErrorText("Error! Please check your connection");
      const timeout: any = setTimeout(() => {
        setError(false);
      }, 2000);
      setWalletHealth(0);

      return () => clearTimeout(timeout);
    }
  }, [error, loading]);

  useEffect(() => {
    if (loading) {
      setWalletHealth(0);
    }
  }, [loading]);

  return (
    <section className="flex mt-20 pt-20 mb-64 md:mx-20 h-full bg-[#000434]">
      <div className="flex flex-col w-full ">
        <div className="flex flex-col  text-center mx-4 gap-7">
          <h2 className="flex items-center  justify-center text-3xl sm:text-5xl lg:text-6xl font-black text-white">
            Introducing Fortress
          </h2>
          <p
            className=" text-xs sm:text-sm 
          lg:text-lg font-normal text-white/50"
          >
            One click to conduct a routine check on your solana wallet
          </p>

          <div
            className="w-full flex flex-col lg:flex-row 
          lg:gap-6 justify-center  sm:mt-20 items-center lg:justify-between "
          >
            <ul className="w-[354px] sm:w-full lg:w-[954px] mt-20 mb-10 gap-16 flex bg-[#33365d]/40 flex-col p-5 sm:p-8 rounded-xl shadow-2xl border border-[#34d4f7]/60">
              <li className="flex gap-5 sm:gap-8 items-center ">
                <span className="text-4xl mt-8 sm:text-6xl">
                  <FaSearchDollar className="border-4 rounded-lg p-1 sm:p-3 border-red-300 fill-red-300" />
                </span>
                <div className="flex flex-col text-start gap-3  w-96 lg:w-full sm:w-[480px]">
                  <h2 className="sm:text-xl font-bold text-green-600">
                    {" "}
                    Quick Scan
                  </h2>
                  <p className="flex w-full text-sm sm:text-base text-gray-300">
                    Conduct a scan and get the details of everything happening
                    in your wallet
                  </p>
                </div>
              </li>

              {/* /////////2/////////////// */}

              <li className="flex gap-5 sm:gap-8 items-center ">
                <span className="text-4xl mt-8 sm:text-6xl">
                  <FaFighterJet className="border-4 rounded-lg p-1 sm:p-3 border-red-300 fill-red-300" />
                </span>
                <div className="flex flex-col text-start gap-3  w-96 lg:w-full sm:w-[480px]">
                  <h2 className="sm:text-xl font-bold text-green-600">
                    {" "}
                    Easy to Use
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300">
                    Get started by just pasting your address and the scanning
                    process will start. Connect wallet only when you want to
                    take ation!
                  </p>
                </div>
              </li>

              {/* ////////////3//////////////// */}

              <li className="flex gap-5 sm:gap-8 items-center ">
                <span className="text-4xl mt-8 sm:text-6xl">
                  <FaBatteryFull className="border-4 rounded-lg p-1 sm:p-3 border-red-300 fill-red-300" />
                </span>
                <div className="flex flex-col text-start gap-3  w-96 lg:w-full sm:w-[480px]">
                  <h2 className="sm:text-xl font-bold text-green-600">
                    {" "}
                    Get Fortified Immediately
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300">
                    You can take action Immediately to revoke token approvals,
                    burn unncessary tokens and so much more in an instant
                  </p>
                </div>
              </li>
            </ul>

            {/* //................. */}

            <div className="flex flex-col px-6 gap-8 mb-10 mt-20 bg-[#33365d]/40   rounded-xl shadow-2xl border border-[#34d4f7]/60 w-[354px] sm:w-full  lg:w-2/5  md:h-[460px] items-center justify-center">
              <div className="relative flex flex-col justify-center items-center  gap-4">
                <p className="text-lg font-black text-green-500">
                  Wallet Fortress Score
                </p>

                <div>
                  <DynamicArc score={walletHealth} />
                </div>
                <span className="text-lg font-medium text-gray-400">
                  {walletStatus}
                </span>
              </div>

              <input
                required
                id="tokenAddress"
                name="tokenAddress"
                type="text"
                placeholder="Enter Wallet Address..."
                value={inputPub}
                onChange={handleChange}
                className="flex  w-full h-7  border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />

              {!showErrorModal ? (
                <p className="text-lg font-black text-green-500">
                  Paste Wallet Address to Scan
                </p>
              ) : (
                <p className="text-lg font-black text-green-500">
                  Paste Wallet Address Again to Scan
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-blue-500 text-white w-40 p-2  rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition-opacity ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="flex items-center justify-center gap-1">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0120 12h-4a4 4 0 00-4-4V4.708C7.704 5.586 5.586 7.704 4.707 10H6v2H2v4.291zM16 14a4 4 0 004-4h-4v4z"
                        ></path>
                      </svg>
                      Scanning
                    </>
                  ) : (
                    "Scan"
                  )}
                </span>
              </button>
              {isFetched && tokenFetched ? (
                <button
                  onClick={showModalFunction}
                  disabled={loading}
                  className="text-red-600 rounded-md hover:text-blue-600 focus:outline-none cursor-pointer focus:text-blue-600 transition-opacity"
                >
                  Show Results
                </button>
              ) : (
                <p className="text-red-600 rounded-md hover:text-blue-600 focus:outline-none cursor-pointer focus:text-blue-600 transition-opacity">
                  {errorText}
                </p>
              )}
            </div>
          </div>

          {showModal && (
            <div className="block fixed z-50  top-0 left-0 w-full  h-full overflow-auto ">
              <div className="bg-gray-800 m-auto relative p-5 ">
                <button
                  className="flex absolute text-black right-4 cursor-pointer justify-end px-5 py-2 text-5xl font-normal "
                  onClick={toggleModal}
                >
                  &times;
                </button>

                <Scanresults
                  tokenHoldings={tokenAccounts}
                  revokeData={userTokenDelegated}
                  nftNumber={nftNumber}
                  nfts={nftInAccounts}
                  strictLists={strictLists}
                  strictNum={strictNum}
                  allLists={allLists}
                  allNum={allNum}
                  unMatched={unmatched}
                  unMatchedNum={unmatchedNum}
                  revokeNum={revokeNum}
                  unknownNft={unknownNft}
                  unknownNftNum={unknownNftNum}
                  unknownTokenNum={unknownTokenNum}
                  validNftNum={validNftNum}
                  unknownToken={unknownToken}
                  validNft={validNft}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Fortress;
