import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey, Connection } from "@solana/web3.js";
import { ENV, TokenListProvider } from "@solana/spl-token-registry";

const endpoint: any = process.env.NEXT_PUBLIC_RPC;

const connection = new Connection(endpoint);

const myApi: any = process.env.NEXT_SHYFT_API;

// const fetchTokenBalances = async (
//   connection: Connection,
//   tokenAccounts: any[]
// ) => {
//   const balances = await Promise.all(
//     tokenAccounts.map(async (account) => {
//       const balance = await connection.getTokenAccountBalance(
//         new PublicKey(account.tokenAccountaddress)
//       );

//       const uiAmount = balance.value.uiAmountString;
//       console.log("Balance:", uiAmount);
//       return { ...account, balance: uiAmount };
//     })
//   );
//   return balances;
// };
export const getTokensMetadata = async (
  tokens: {
    tokenAccountaddress: string[] | any;
    mintAdddress: any;
    balance: number;
  }[],
  connection: Connection
) => {
  const metaplex = new Metaplex(connection);
  const provider = await new TokenListProvider().resolve();
  const tokenList = provider.filterByChainId(ENV.MainnetBeta).getList();

  const tokenMap = tokenList.reduce((map, item) => {
    map.set(item.address, item);
    return map;
  }, new Map());

  const tokensMetadata = await Promise.all(
    tokens.map(async (token) => {
      const tokenAccount = token.tokenAccountaddress;
      const mint = token.mintAdddress;
      const mintPublickey = new PublicKey(mint);
      const amount = token.balance;
      let name = "";
      let logoURI = "";
      try {
        const token = await metaplex
          .nfts()
          .findByMint({ mintAddress: mintPublickey });
        name = token.name;
        if (name == "") {
          const _name = token.json?.name;
          if (_name != undefined && _name != "") {
            name = _name;
          } else {
            name = "Unknown token";
          }
        }
        const _logoURI = token.json?.image;
        if (_logoURI != undefined && _logoURI != "") {
          logoURI = _logoURI;
        } else {
          const _token = tokenMap.get(mint);
          if (!_token || !_token.logoURI) {
            logoURI =
              "https://arweave.net/WCMNR4N-4zKmkVcxcO2WImlr2XBAlSWOOKBRHLOWXNA";
          } else {
            logoURI = _token.logoURI;
          }
        }
      } catch (error) {
        const token = tokenMap.get(mint);
        if (!token || !token.logoURI) {
          logoURI =
            "https://arweave.net/WCMNR4N-4zKmkVcxcO2WImlr2XBAlSWOOKBRHLOWXNA";
        } else {
          logoURI = token.logoURI;
        }
        if (!token || !token.name) {
          name = "Unknown token";
        } else {
          name = token.name;
        }
      }
      // possibly add price side here...
      return { name, logoURI, tokenAccount, mint, amount };
    })
  );
  tokensMetadata.sort(function (a, b) {
    if (a.name.toUpperCase() < b.name.toUpperCase()) {
      return -1;
    }
    if (a.name.toUpperCase() > b.name.toUpperCase()) {
      return 1;
    }
    return 0;
  });

  return tokensMetadata;
};

export const getNftsMetadata = async (
  tokens: {
    tokenAccountaddress?: string[] | any;
    mintAdddress: any;
  }[],
  connection: Connection
) => {
  const metaplex = new Metaplex(connection);
  const provider = await new TokenListProvider().resolve();
  const tokenList = provider.filterByChainId(ENV.MainnetBeta).getList();

  const tokenMap = tokenList.reduce((map, item) => {
    map.set(item.address, item);
    return map;
  }, new Map<string, any>());

  const tokensMetadata = await Promise.all(
    tokens.map(async (token) => {
      const tokenAccount = token.tokenAccountaddress;
      if (!token.mintAdddress) {
        console.error("Mint address is missing for token:", token);
        return null;
      }
      const mint = token.mintAdddress;

      const amount = 1;
      let name = "";
      let logoURI = "";
      try {
        // const mintPublickey = new PublicKey(mint);
        const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
        name = nft.name || nft.json?.name || "Unknown token";
        logoURI =
          nft.json?.image ||
          tokenMap.get(mint)?.logoURI ||
          "https://arweave.net/WCMNR4N-4zKmkVcxcO2WImlr2XBAlSWOOKBRHLOWXNA";
      } catch (error) {
        console.error(
          "Error fetching NFT metadata for mint address:",
          mint,
          error
        );
        const fallbackToken = tokenMap.get(mint);
        name = fallbackToken?.name || "Unknown token";
        logoURI =
          fallbackToken?.logoURI ||
          "https://arweave.net/WCMNR4N-4zKmkVcxcO2WImlr2XBAlSWOOKBRHLOWXNA";
      }

      return { name, logoURI, tokenAccount, mint, amount };
    })
  );

  const validTokensMetadata = tokensMetadata.filter(Boolean);

  validTokensMetadata.sort((a: any, b: any) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) {
      return -1;
    }
    if (a.name.toUpperCase() > b.name.toUpperCase()) {
      return 1;
    }
    return 0;
  });

  return validTokensMetadata;
};

export const getTokenStatus = async (
  tokens: {
    name: string;
    logoURI: string;
    tokenAccount: any;
    mint: any;
    amount: number;
  }[]
) => {
  try {
    const response = await fetch("https://token.jup.ag/strict");
    const strictTokenList = await response.json();

    const matchedTokensPromises = tokens.map(async (token) => {
      const matchedToken = strictTokenList.find(
        (strictToken: any) => strictToken.address === token.mint
      );

      if (matchedToken) {
        return {
          mintAddress: token.mint,
          address: matchedToken.address,
          name: matchedToken.name,
          symbol: matchedToken.symbol,
          image: matchedToken.logoURI,
          tags: matchedToken.tags,
          amount: token.amount,
        };
      }

      return null;
    });

    const matchedTokens = await Promise.all(matchedTokensPromises);

    return matchedTokens.filter((token) => token !== null);
  } catch (error) {
    console.error("Error fetching token status:", error);
    return [];
  }
};

export const getAllTokenStatus = async (
  tokens: {
    name: string;
    logoURI: string;
    tokenAccount: any;
    mint: any;
    amount: number;
  }[]
) => {
  try {
    const response = await fetch("https://token.jup.ag/all");
    const allTokenList = await response.json();

    const matchedTokens = tokens
      .map((token) => {
        const matchedToken = allTokenList.find(
          (allToken: any) => allToken.address === token.mint
        );
        if (matchedToken) {
          return {
            mintAddress: token.mint,
            address: matchedToken.address,
            name: matchedToken.name,
            symbol: matchedToken.symbol,
            image: matchedToken.logoURI,
            tags: matchedToken.tags,
            amount: token.amount,
          };
        }
        return null;
      })
      .filter((token) => token !== null);
    return matchedTokens;
  } catch (error) {
    console.error("Error fetching all token status:", error);
    return [];
  }
};

export const getAllNfts = async (walletAddress: string | any) => {
  try {
    const response = await fetch(
      `https://api.shyft.to/sol/v1/wallet/get_portfolio?network=mainnet-beta&wallet=${walletAddress}`,
      {
        method: "GET",
        headers: {
          "x-api-key": " DSKXJdx3MYH_3TNP",
        },
      }
    );
    const { result } = await response.json();

    console.log(result);

    return result;
  } catch (error) {
    console.error("Error fetching NFT:", error);
    return [];
  }
};

// 0
// :
//
// :
// "So11111111111111111111111111111111111111112"
// chainId
// :
// 101
// decimals
// :
// 9
// extensions
// :
// {coingeckoId: 'wrapped-solana'}
// logoURI
// :
// "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
// name
// :
// "Wrapped SOL"
// symbol
// :
// "SOL"

export const getTokenBadge = async (tokenAddress: any) => {
  try {
    const response = await fetch("https://token.jup.ag/strict");
    const verifiedTokenList: any[] | any = await response.json();

    const verifiedAddress = verifiedTokenList.map((addy: any) => addy.address);

    const isTokenVerified = verifiedAddress.includes(tokenAddress);

    return isTokenVerified;
  } catch (error) {
    console.error("Error fetching data:", error);

    return false;
  }
};
