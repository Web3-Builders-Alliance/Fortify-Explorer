"use client";
import { FC, useState, useEffect, useCallback } from "react";
import { PublicKey, Transaction, Connection } from "@solana/web3.js";
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  getTokensMetadata,
  getAllNfts,
  getTokenStatus,
  getAllTokenStatus,
} from "./getTokensMetadata";

export type AccountData = {
  name?: string;
  logoURI?: string;
  tokenAccount?: any;
  mint: string[] | any;
  amount: number;
};

type TokenData = {
  name: string;
  tokenaddress: string | any;
  balance: number;
  price: number;
  value: number;
};

type NftData = {
  name: string;
  image: any;
};

type TrxData = {
  signature: string | any;
  time: string;
  instruction: string;
  by: string | any;
  fee: number;
};

interface ExplorerAnalysisProps {
  inputPub: string;
  tokenHoldings: number | any[];
  revokeData: number | any[];
  nftNumber: number;
  nfts: any[];
  strictLists: any[];
  strictNum: number;
  allLists: any[];
  allNum: number;
  unMatched: any[];
  unMatchedNum: number;
  revokeNum: number;
  unknownNft: any[];
  unknownNftNum: number;
  unknownTokenNum: number;
  validNftNum: number;
  unknownToken: number;
  validNft: any[];
}

const endpoint: any = process.env.NEXT_PUBLIC_RPC;

const connection = new Connection(endpoint);

export const useExploreData = ({ inputPub }: { inputPub: string }) => {
  const [loading, setLoading] = useState(false);
  const [tokenFetched, setTokenFetched] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [isFetched, setIsFetched] = useState<boolean>(false);

  const getTokenAccountsByOwner = async (
    connection: Connection,
    publicKey: PublicKey
  ) => {
    const { value: splAccounts } = await connection.getTokenAccountsByOwner(
      publicKey,
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      },
      "processed"
    );
    return splAccounts;
  };

  const processTokenAccounts = (splAccounts: any) => {
    return splAccounts.map((m: any) => {
      const data = m.account.data;
      const info = AccountLayout.decode(data);
      const mintAdddress = new PublicKey(info.mint).toBase58();
      const tokenAccountaddress = m.pubkey.toBase58();
      return {
        tokenAccountaddress,
        mintAdddress,
        delegateOption: info.delegateOption,
      };
    });
  };

  const fetchTokenBalances = async (
    connection: Connection,
    tokenAccounts: any[]
  ) => {
    const balances = await Promise.all(
      tokenAccounts.map(async (account) => {
        const balance = await connection.getTokenAccountBalance(
          new PublicKey(account.tokenAccountaddress)
        );

        const uiAmount = balance.value.uiAmountString;
        console.log("Balance:", uiAmount);
        return { ...account, balance: uiAmount };
      })
    );
    return balances;
  };

  const getUserTokenDelegated = async (inputPub: string) => {
    if (!inputPub) {
      return;
    }
    const publicKey = new PublicKey(inputPub);

    setIsFetched(false);

    try {
      const splAccounts = await getTokenAccountsByOwner(connection, publicKey);

      const tokenAccounts = processTokenAccounts(splAccounts);
      const tokenDelegated = tokenAccounts.filter(
        (m: any) => m.delegateOption != 0
      );

      const tokenDelegatedMetadata = await getTokensMetadata(
        tokenDelegated,
        connection
      );

      return {
        tokenHoldings: [],
        revokeData: tokenDelegatedMetadata,
        nftNumber: 0,
        nfts: [],
        strictLists: [],
        strictNum: 0,
        allLists: [],
        allNum: 0,
        unMatched: [],
        unMatchedNum: 0,
        revokeNum: tokenDelegatedMetadata.length,
        unknownNft: [],
        unknownNftNum: 0,
        unknownTokenNum: 0,
        validNftNum: 0,
        unknownToken: [],
        validNft: [],
      };
    } catch (error) {
      console.error("Error fetching delegated tokens:", error);
    }
  };

  const getUserTokenAccounts = async (inputPub: string) => {
    if (!inputPub) {
      setTokenFetched(true);
      setIsFetched(true);
      return;
    }
    const publickey: PublicKey = new PublicKey(inputPub);
    setTokenFetched(false);

    try {
      const splAccounts = await getTokenAccountsByOwner(connection, publickey);
      const tokenAccounts = processTokenAccounts(splAccounts);

      const tokenAccountsWithBalances = await fetchTokenBalances(
        connection,
        tokenAccounts
      );

      // console.log(tokenAccountsWithBalances);

      const accountTokens = await getTokensMetadata(
        tokenAccountsWithBalances,
        connection
      );
      console.log(accountTokens);

      const [strictList, allList] = await Promise.all([
        getTokenStatus(accountTokens),
        getAllTokenStatus(accountTokens),
      ]);

      const remainingToken = allList.filter((allItem: any) => {
        return !strictList.some(
          (strictItem: any) => strictItem.address === allItem.address
        );
      });

      return {
        tokenHoldings: accountTokens,
        revokeData: [],
        nftNumber: 0,
        nfts: [],
        strictLists: strictList,
        strictNum: strictList.length,
        allLists: allList,
        allNum: allList.length,
        unMatched: remainingToken,
        unMatchedNum: remainingToken.length,
        revokeNum: 0,
        unknownNft: [],
        unknownNftNum: 0,
        unknownTokenNum: 0,
        validNftNum: [],
        unknownToken: [],
        validNft: [],
      };
    } catch (error) {
      console.error("Error Fetching Tokens:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getNftsInWallet = async (inputPub: string) => {
    const publicKey = new PublicKey(inputPub);

    try {
      const nftInWallet = await getAllNfts(inputPub);

      const nftArray = nftInWallet.nfts || [];

      const splAccounts = await getTokenAccountsByOwner(connection, publicKey);
      const tokenAccounts = processTokenAccounts(splAccounts);

      const tokenAccountsWithBalances = await fetchTokenBalances(
        connection,
        tokenAccounts
      );

      const accountTokens = await getTokensMetadata(
        tokenAccountsWithBalances,
        connection
      );

      const filteredTokens = accountTokens.filter((token) =>
        nftArray.some((nft: any) => nft.mintAddress === token.mint)
      );

      const verifiedMainNfts = nftArray.filter((item: any) => {
        return item.collection && item.collection.verified === true;
      });

      const verifiedNfts = filteredTokens.filter((token) =>
        verifiedMainNfts.some((nft: any) => nft.mintAddress === token.mint)
      );

      const unVerifiedMainNfts = nftArray.filter((item: any) => {
        return (
          !item.collection ||
          (item.collection && item.collection.verified !== true)
        );
      });

      const unVerifiedNfts = filteredTokens.filter((token) =>
        unVerifiedMainNfts.some((nft: any) => nft.mintAddress === token.mint)
      );

      console.log("Verified NFTs:", verifiedNfts);
      console.log("Unverified NFTs:", unVerifiedNfts);

      // console.log(verifiedNfts);
      return {
        tokenHoldings: [],
        revokeData: [],
        nftNumber: nftArray.length,
        nfts: nftArray,
        strictLists: [],
        strictNum: 0,
        allLists: [],
        allNum: 0,
        unMatched: [],
        unMatchedNum: 0,
        revokeNum: 0,
        unknownNft: unVerifiedNfts,
        unknownNftNum: unVerifiedNfts.length,
        unknownTokenNum: 0,
        validNftNum: verifiedNfts.length,
        unknownToken: [],
        validNft: verifiedNfts,
      };
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return;
    }
  };
  return {
    getNftsInWallet,
    getUserTokenAccounts,
    getUserTokenDelegated,
  };
};

// useEffect(() => {
//   const mainListMints = nftInAccounts.map((item: any) => item.mintAddress);

//   const mainTokenListMint = tokenAccounts.map((item: any) => item.mint);

//   const firstList = mainTokenListMint.filter(
//     (mint: any) => !mainListMints.includes(mint)
//   );

//   const nftMints = allLists.map((item: any) => item.address);

//   const unknownTokens = firstList.filter(
//     (mint: any) => !nftMints.includes(mint)
//   );

//   setUnknownToken(unknownToken);
//   setUnknownTokenNum(unknownTokens.length);
// }, [allLists, nftInAccounts, tokenAccounts]);

// const tokenLength: number = tokenAccounts.length;
// // calculation  block for the wallet heakth////////////////////////////////
// useEffect(() => {
//   // Ensure tokenAccounts has been fetched
//   if (
//     tokenAccounts.length === 0 ||
//     typeof tokenLength !== "number" ||
//     typeof revokeNum !== "number" ||
//     typeof strictNum !== "number" ||
//     typeof allNum !== "number" ||
//     typeof validNftNum !== "number" ||
//     typeof nftNumber !== "number" ||
//     typeof unknownTokenNum !== "number" ||
//     typeof unknownNftNum !== "number"
//   ) {
//     return;
//   }

//   // Calculate revoke points
//   const unrevoked = tokenLength - revokeNum;
//   const revokePoints = tokenLength === 0 ? 0 : (unrevoked / tokenLength) * 60;

//   // Calculate token part scores
//   const groupToken = allNum === 0 ? 0 : (strictNum / allNum) * 30;
//   const groupNft = nftNumber === 0 ? 0 : (validNftNum / nftNumber) * 10;

//   // Calculate unknown part score
//   const unknownPart =
//     tokenLength === 0 || nftNumber === 0
//       ? 0
//       : (unknownTokenNum / tokenLength + unknownNftNum / nftNumber) * 15;

//   // Calculate token percentile
//   const tokenPercentile = groupToken + groupNft - unknownPart;

//   // Calculate total wallet health score
//   const totalWallet = revokePoints + tokenPercentile;

//   const finalScore = Math.round(totalWallet);

//   const getStatus = (score: any) => {
//     if (score >= 0 && score <= 15) return "Critical";
//     if (score >= 16 && score <= 35) return "Unsafe";
//     if (score >= 36 && score <= 45) return "Vulnerable";
//     if (score >= 46 && score <= 60) return "Degen but Okay";
//     if (score >= 61 && score <= 75) return "Stable";
//     if (score >= 76 && score <= 85) return "Healthy";
//     if (score >= 86 && score <= 93) return "Fortified";
//     if (score >= 94 && score <= 100) return "Excellent";
//     return "Unknown";
//   };

//   setWalletStatus(getStatus(finalScore));

//   // Set wallet health state
//   setWalletHealth(finalScore);
// }, [
//   tokenAccounts,
//   tokenLength,
//   revokeNum,
//   strictNum,
//   allNum,
//   validNftNum,
//   nftNumber,
//   unknownTokenNum,
//   unknownNftNum,
// ]);

// useEffect(() => {
//   if (isFetched && tokenFetched) {
//     const timeOutLoader = setTimeout(() => {
//       setLoading(false);
//     }, 4000);

//     return () => clearTimeout(timeOutLoader);
//   }
// }, [isFetched, tokenFetched]);

// useEffect(() => {
//   if (isFetched && tokenFetched) {
//     const timeOutLoader = setTimeout(() => {
//       setIsFetched(false);
//       setTokenFetched(false);
//     }, 14000);

//     return () => clearTimeout(timeOutLoader);
//   }
// }, [isFetched, tokenFetched]);

// useEffect(() => {
//   if (error) {
//     // setErrorText("Error! Please check your connection");
//     const timeout: any = setTimeout(() => {
//       setError(false);
//     }, 2000);
//     setWalletHealth(0);

//     return () => clearTimeout(timeout);
//   }
// }, [error, loading]);

// useEffect(() => {
//   if (loading) {
//     setWalletHealth(0);
//   }
// }, [loading]);

export const trxList: TrxData[] = [
  {
    signature:
      "4ZRjJ4aQbYnTDBxwd9rvfHtSWsVtFqtwQKfRAGS4HkZirwtPcfQS8sbZ1UvHe8x9kj23QLQcmSztJTBNmSmwFcDN",
    time: "20 days ago",
    instruction: "setComputeUnitPrice",
    by: "Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o",
    fee: 0.002,
  },

  {
    signature:
      "4ZRjJ4aQbYnTDBxwd9rvfHtSWsVtFqtwQKfRAGS4HkZirwtPcfQS8sbZ1UvHe8x9kj23QLQcmSztJTBNmSmwFcDN",
    time: "20 days ago",
    instruction: "setComputeUnitPrice",
    by: "Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o",
    fee: 0.002,
  },

  {
    signature:
      "4ZRjJ4aQbYnTDBxwd9rvfHtSWsVtFqtwQKfRAGS4HkZirwtPcfQS8sbZ1UvHe8x9kj23QLQcmSztJTBNmSmwFcDN",
    time: "20 days ago",
    instruction: "setComputeUnitPrice",
    by: "Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o",
    fee: 0.002,
  },

  {
    signature:
      "4ZRjJ4aQbYnTDBxwd9rvfHtSWsVtFqtwQKfRAGS4HkZirwtPcfQS8sbZ1UvHe8x9kj23QLQcmSztJTBNmSmwFcDN",
    time: "20 days ago",
    instruction: "setComputeUnitPrice",
    by: " Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o",
    fee: 0.002,
  },

  {
    signature:
      "4ZRjJ4aQbYnTDBxwd9rvfHtSWsVtFqtwQKfRAGS4HkZirwtPcfQS8sbZ1UvHe8x9kj23QLQcmSztJTBNmSmwFcDN",
    time: "20 days ago",
    instruction: "setComputeUnitPrice",
    by: " Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o",
    fee: 0.002,
  },

  {
    signature:
      "4ZRjJ4aQbYnTDBxwd9rvfHtSWsVtFqtwQKfRAGS4HkZirwtPcfQS8sbZ1UvHe8x9kj23QLQcmSztJTBNmSmwFcDN",
    time: "20 days ago",
    instruction: "setComputeUnitPrice",
    by: " Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o",
    fee: 0.002,
  },

  {
    signature:
      "4ZRjJ4aQbYnTDBxwd9rvfHtSWsVtFqtwQKfRAGS4HkZirwtPcfQS8sbZ1UvHe8x9kj23QLQcmSztJTBNmSmwFcDN",
    time: "20 days ago",
    instruction: "setComputeUnitPrice",
    by: " Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o",
    fee: 0.002,
  },

  {
    signature:
      "4ZRjJ4aQbYnTDBxwd9rvfHtSWsVtFqtwQKfRAGS4HkZirwtPcfQS8sbZ1UvHe8x9kj23QLQcmSztJTBNmSmwFcDN",
    time: "20 days ago",
    instruction: "setComputeUnitPrice",
    by: " Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o",
    fee: 0.002,
  },

  {
    signature:
      "4ZRjJ4aQbYnTDBxwd9rvfHtSWsVtFqtwQKfRAGS4HkZirwtPcfQS8sbZ1UvHe8x9kj23QLQcmSztJTBNmSmwFcDN",
    time: "20 days ago",
    instruction: "setComputeUnitPrice",
    by: " Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o",
    fee: 0.002,
  },

  {
    signature:
      "4ZRjJ4aQbYnTDBxwd9rvfHtSWsVtFqtwQKfRAGS4HkZirwtPcfQS8sbZ1UvHe8x9kj23QLQcmSztJTBNmSmwFcDN",
    time: "20 days ago",
    instruction: "setComputeUnitPrice",
    by: " Fhe6eV2KAUccfZ39QuSD9eBYV5fUxMzHg2HSEe5Q4R7o",
    fee: 0.002,
  },
];

export const NftList: NftData[] = [
  {
    name: "MadLads #2233",
    image: "/images/FORTIFYL.png",
  },

  {
    name: "DE GODS",
    image: "/images/FORTIFYL.png",
  },

  {
    name: "Kamino Cards",
    image: "/images/FORTIFYL.png",
  },

  {
    name: "Wormhole Pass",
    image: "/images/FORTIFYL.png",
  },

  {
    name: "Dogs on Solana",
    image: "/images/FORTIFYL.png",
  },

  {
    name: "Renegade Cats",
    image: "/images/FORTIFYL.png",
  },
  {
    name: "Renegade Cats",
    image: "/images/FORTIFYL.png",
  },
  {
    name: "Renegade Cats",
    image: "/images/FORTIFYL.png",
  },
  {
    name: "Renegade Cats",
    image: "/images/FORTIFYL.png",
  },
  {
    name: "Renegade Cats",
    image: "/images/FORTIFYL.png",
  },
  {
    name: "Renegade Cats",
    image: "/images/FORTIFYL.png",
  },
  {
    name: "Renegade Cats",
    image: "/images/FORTIFYL.png",
  },
];

export const tokensList: TokenData[] = [
  {
    name: "Jupiter Token",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 3000,
    price: 0.8,
    value: 2400,
  },

  {
    name: "USD Coin",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 6000,
    price: 1,
    value: 6000,
  },

  {
    name: "Kamino",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 30000,
    price: 0.033,
    value: 2400,
  },

  {
    name: "Wormhole Token",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 3000,
    price: 0.62,
    value: 1860,
  },

  {
    name: "Dogwifhat",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 1000,
    price: 2,
    value: 2000,
  },

  {
    name: "io.net",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 300,
    price: 2.39,
    value: 717,
  },

  {
    name: "Orca",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 500,
    price: 1.67,
    value: 835,
  },

  {
    name: "Pyth Network",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 3600,
    price: 0.2,
    value: 720,
  },

  {
    name: "Bonk",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 30000000,
    price: 0.00002,
    value: 600,
  },

  {
    name: "Jito",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 3000,
    price: 2,
    value: 6000,
  },
];

export const unknownList: TokenData[] = [
  {
    name: "USD Coin",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 6000,
    price: 1,
    value: 6000,
  },

  {
    name: "Kamino",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 30000,
    price: 0.033,
    value: 2400,
  },

  {
    name: "Dogwifhat",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 1000,
    price: 2,
    value: 0,
  },

  {
    name: "io.net",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 0,
    price: 0,
    value: 0,
  },

  {
    name: "Bonk",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 3,
    price: 0,
    value: 0,
  },

  {
    name: "Jito",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 3000,
    price: 0,
    value: 0,
  },
  {
    name: "USD Coin",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 6000,
    price: 1,
    value: 6000,
  },
  {
    name: "USD Coin",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 6000,
    price: 1,
    value: 6000,
  },
  {
    name: "USD Coin",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 6000,
    price: 1,
    value: 6000,
  },
  {
    name: "USD Coin",
    tokenaddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    balance: 6000,
    price: 1,
    value: 6000,
  },
];
