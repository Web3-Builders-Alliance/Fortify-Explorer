"use client";

import React, { FC, useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Loader from "@/components/ui/Loader";
import { PublicKey, Transaction, Connection } from "@solana/web3.js";
import {
  getTokensMetadata,
  getAllNfts,
  getTokenStatus,
  getAllTokenStatus,
} from "@/components/utils/getTokensMetadata";
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { debounce } from "lodash";

import { FaSearchDollar, FaFighterJet, FaBatteryFull } from "react-icons/fa";
import { TbCircleDotted } from "react-icons/tb";
import Scanresults from "@/components/ui/scanresults";

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

    // Set wallet health state
    setWalletHealth(finalScore);

    // Log individual scores
    console.log("Token Score:", groupToken);
    console.log("NFT Score:", groupNft);
    console.log("Unknown Score:", unknownPart);
    console.log("Token Percentile:", tokenPercentile);
    console.log("Total Wallet Points:", totalWallet);
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

    setTimeout(getUserTokenAccounts, 5000);

    await setTimeout(() => getNftsInWallet(inputPub), 8000);
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
      }, 30000);

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
              <div className="relative flex flex-col justify-center items-center mt-6 gap-6">
                <p className="text-lg font-black text-green-500">
                  Wallet Fortress Score
                </p>
                <span className="flex justify-center text-9xl w-40 text-red-600">
                  <TbCircleDotted />
                </span>
                <p className="absolute top-20 mt-2 text-5xl text-green-500/60">
                  {walletHealth}
                </p>
              </div>

              <input
                required
                id="tokenAddress"
                name="tokenAddress"
                type="text"
                placeholder="Enter Wallet Address..."
                value={inputPub}
                onChange={handleChange}
                className="flex  w-full h-9  border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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

          {/* {!connected ? (
            <p className="mt-6 bg-green-600 p-6 rounded-lg font-semibold text-lg ">
              Connect to Scan your wallet
            </p>
          ) : (
            <Scan />
          )} */}
        </div>
      </div>
    </section>
  );
};

const Scan: FC = ({}) => {
  const { connection } = useConnection();

  const wallet = useWallet();

  const [tokenAccounts, setTokenAccounts] = useState<any | null>(null);
  const [userTokenDelegated, setUserTokenDelegated] = useState<any | null>(
    null
  );
  const [tokenFetched, setTokenFetched] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isRevoking, setIsRevoking] = useState<boolean>(false);
  const [currentTx, setCurrentTx] = useState<number | null>(null);
  const [totalTx, setTotalTx] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [toRevoke, setToRevoke] = useState<any>([]);

  // get All Token Holdings
  async function getUserTokenAccounts() {
    if (!wallet.publicKey) {
      setTokenAccounts([]);
      return;
    }
    const publickey = wallet.publicKey;
    setTokenFetched(false);

    const { value: splTokens } = await connection.getTokenAccountsByOwner(
      publickey,
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      },
      "processed"
    );

    const tokensFromAccount = splTokens.map((t) => {
      const data = t.account.data;
      const info = AccountLayout.decode(data);
      const mintAdddress = new PublicKey(info.mint).toBase58();
      const tokenAccountaddress = t.pubkey.toBase58();
      return { tokenAccountaddress, mintAdddress };
    });

    const accountTokens = await getTokensMetadata(
      tokensFromAccount,
      connection
    );

    setTokenAccounts(accountTokens);
    setTokenFetched(true);

    console.log("user tokens", accountTokens);
  }

  const debouncedGetUserTokenAccounts = debounce(getUserTokenAccounts, 1000);

  async function getUserTokenDelegated() {
    if (!wallet.publicKey) {
      setUserTokenDelegated([]);
      return;
    }
    const publickey = wallet.publicKey;
    const pb = publickey.toBase58();

    console.log("pubKey:", pb);
    setIsFetched(false);

    const { value: splAccounts } = await connection.getTokenAccountsByOwner(
      publickey,
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      },
      "processed"
    );

    console.log("value:", splAccounts);

    // checks for delegated token accounts
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

    console.log("TOkenDelegated:", tokenDelegated);

    const tokenDelegatedMetadata = await getTokensMetadata(
      tokenDelegated,
      connection
    );

    setUserTokenDelegated(tokenDelegatedMetadata);
    setIsFetched(true);
    console.log("user delegated tokens", tokenDelegatedMetadata);
  }

  useEffect(() => {
    getUserTokenDelegated();
    debouncedGetUserTokenAccounts();
  }, [wallet.publicKey]);

  function SelectButton(props: { token: any }) {
    const [isSelected, setIsSelected] = useState(false);
    const tokenAccount = props.token.tokenAccount;

    return (
      <div>
        {!isSelected ? (
          <button
            className="py-2 px-2 font-bold rounded-xl text-xs bg-[#663b99] hover:bg-[#36185b] uppercase sm:ml-1 mb-2 sm:mb-4"
            onClick={() => {
              setIsSelected(true);
              toRevoke.push(tokenAccount);
            }}
          >
            Select
          </button>
        ) : (
          <button
            className="py-2 px-2 font-bold rounded-xl text-xs bg-[#36185b] hover:bg-[#663b99] uppercase sm:ml-1 mb-2 sm:mb-4"
            onClick={() => {
              setIsSelected(false);
              toRevoke.splice(toRevoke.indexOf(tokenAccount), 1);
            }}
          >
            Unselect
          </button>
        )}
      </div>
    );
  }

  const Revoke = async () => {
    const publickey = wallet.publicKey;
    try {
      if (toRevoke[0] != undefined && publickey) {
        setIsRevoking(true);
        setSuccess(false);
        setMessage("");
        const nbPerTx = 5;
        let nbTx: number;
        if (toRevoke.length % nbPerTx == 0) {
          nbTx = toRevoke.length / nbPerTx;
        } else {
          nbTx = Math.floor(toRevoke.length / nbPerTx) + 1;
        }
        setTotalTx(nbTx);

        for (let i = 0; i < nbTx; i++) {
          setCurrentTx(i + 1);
          let Tx = new Transaction();

          let bornSup: number;

          if (i == nbTx - 1) {
            bornSup = toRevoke.length;
          } else {
            bornSup = nbPerTx * (i + 1);
          }

          for (let j = nbPerTx * i; j < bornSup; j++) {
            const account = new PublicKey(toRevoke[j].tokenAccount);

            const RevokeInstruction = Token.createRevokeInstruction(
              TOKEN_PROGRAM_ID,
              account,
              publickey,
              []
            );

            Tx.add(RevokeInstruction);
          }

          const signature = await wallet.sendTransaction(Tx, connection);
          const confirmed = await connection.confirmTransaction(
            signature,
            "processed"
          );
          console.log("confirmation", signature);
        }
        setToRevoke([]);
        setIsRevoking(false);
        setSuccess(true);
        await getUserTokenDelegated();
      } else {
        setMessage("Please choose at least one token to revoke first!");
        setSuccess(false);
      }
    } catch (error) {
      await getUserTokenDelegated();
      setToRevoke([]);
      setIsRevoking(false);
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className="">
        <div className="text-center pt-2">
          <div className="hero min-h-16 p-0 pt-10">
            <div className="text-center hero-content w-full">
              <div className="w-full">
                <div className="mb-auto my-10">
                  {!wallet.publicKey && (
                    <div className="text-center text-2xl pt-16">
                      Please, connect your wallet!
                    </div>
                  )}

                  {!isFetched && wallet.publicKey && (
                    <div className="mt-[25%]">
                      <Loader text="Fetching tokens..." />
                    </div>
                  )}

                  {isFetched && wallet.publicKey && (
                    <div>
                      {userTokenDelegated.length ? (
                        <div className="flex justify-center">
                          {!isRevoking ? (
                            <button
                              className="btn mx-2"
                              onClick={() => Revoke()}
                            >
                              Revoke All Selected
                            </button>
                          ) : (
                            <button className="btn mx-2">
                              <svg
                                role="status"
                                className="inline mr-3 w-4 h-4 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="#E5E7EB"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentColor"
                                />
                              </svg>
                              Revoking...
                            </button>
                          )}
                        </div>
                      ) : null}

                      <div className="my-2">
                        {isRevoking && currentTx != null && totalTx != null ? (
                          <div>
                            Please confirm Tx: {currentTx}/{totalTx}
                          </div>
                        ) : (
                          <div className="h-[27px]"></div>
                        )}
                      </div>

                      <div className="my-2">
                        {success ? (
                          <div className="text-[#00FF00]">
                            Successfully closed!
                          </div>
                        ) : (
                          <div className="h-[27px]"></div>
                        )}
                      </div>

                      <div className="my-2">
                        {message != "" ? (
                          <div className="text-[#FF0000]">{message}</div>
                        ) : (
                          <div className="h-[27px]"></div>
                        )}
                      </div>

                      {!userTokenDelegated.length ? (
                        <div className="text-center text-2xl pt-16">
                          No delegated token found in this wallet
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
                          {userTokenDelegated?.map((token: any) => (
                            <div
                              key={token}
                              className={`card bg-[#15263F] max-w-xs rounded-xl border-2 border-[#FFFFFF]`}
                            >
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                  }}
                                >
                                  <img
                                    src={token.logoURI}
                                    className="mt-4 rounded-xl w-[125px] h-[125px] sm:w-[200px] sm:h-[200px] md:w-[160px] md:h-[160px] lg:w-[200px] lg:h-[200px] "
                                  ></img>
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    lineHeight: "19.08px",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {token.name}
                                </div>
                              </div>

                              <div className="flex justify-around my-2">
                                <SelectButton token={token} />
                                <a
                                  target="_blank"
                                  rel="noreferrer"
                                  className="py-2 px-2 font-bold rounded-xl text-xs bg-[#9945FF] hover:bg-[#7a37cc] uppercase sm:ml-1 mb-2 sm:mb-4"
                                  href={
                                    "https://solscan.io/token/" + token.mint
                                  }
                                >
                                  Check Solscan
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fortress;
