import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey, Connection } from "@solana/web3.js";
import { ENV, TokenListProvider } from "@solana/spl-token-registry";
import { verify } from "crypto";

const myApi = "DSKXJdx3MYH_3TNP";

export const getTokensMetadata = async (
  tokens: {
    tokenAccountaddress: string[] | any;
    mintAdddress: any;
    amount?: number;
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
      const amount = token.amount;
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

export const getTokenStatus = async (mintAddresses: any[]) => {
  try {
    const response = await fetch("https://token.jup.ag/strict");
    const strictTokenList = await response.json();

    const matchedTokens = mintAddresses
      .map((mintAddress) => {
        const matchedToken = strictTokenList.find(
          (token: any) => token.address === mintAddress
        );
        if (matchedToken) {
          return {
            mintAddress,
            address: matchedToken.address,
            name: matchedToken.name,
            Symbol: matchedToken.symbol,
            imgage: matchedToken.logoURI,
            tags: matchedToken.tags,
          };
        }
        return null;
      })
      .filter((token) => token !== null);
    return matchedTokens;
  } catch (error) {
    console.error("Error fetching token status:", error);
    return [];
  }
};

export const getAllTokenStatus = async (mintAddresses: any[]) => {
  try {
    const response = await fetch("https://token.jup.ag/all");
    const allTokenList = await response.json();

    const matchedTokens = mintAddresses
      .map((mintAddress) => {
        const matchedToken = allTokenList.find(
          (token: any) => token.address === mintAddress
        );
        if (matchedToken) {
          return {
            mintAddress,
            address: matchedToken.address,
            name: matchedToken.name,
            Symbol: matchedToken.symbol,
            imgage: matchedToken.logoURI,
            tags: matchedToken.tags,
          };
        }
        return null;
      })
      .filter((token) => token !== null);
    return matchedTokens;
  } catch (error) {
    console.error("Error fetching token status:", error);
    return [];
  }
};

export const getAllNfts = async (walletAddress: string) => {
  try {
    const response = await fetch(
      `https://api.shyft.to/sol/v1/wallet/get_portfolio?network=mainnet-beta&wallet=${walletAddress}`,
      {
        method: "GET",
        headers: {
          "x-api-key": myApi,
        },
      }
    );
    const { result } = await response.json();

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
