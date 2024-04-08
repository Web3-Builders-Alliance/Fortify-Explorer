const rpc =
  "https://mainnet.helius-rpc.com/?api-key=90abe477-bdbe-4add-af28-800bf2ca2e04";
// for dev purposes only. will move to .env after testing. This is helius

// UMI instance for getting token security details

async function getFirstData(token: any) {
  console.log("token fetched:", token);
  try {
    const responseData = await fetch(rpc, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAsset",
        params: {
          id: token,
          displayOptions: {
            showFungible: true,
          },
        },
      }),
    });
    const { result } = await responseData.json();

    console.log("results:", result);

    let id, mutable, burnt;

    if (result) {
      ({ id, mutable, burnt } = result);
    } else {
      id = undefined;
      mutable = undefined;
      burnt = undefined;
    }

    let name,
      description,
      token_standard,
      symbol,
      tokenImage,
      creatorAddress,
      uA,
      scopes,
      ownerRenounced,
      supply,
      decimals,
      price,
      fdmc;

    if (result.content && result.content.metadata) {
      const {
        name: resultName,
        description: resultDescription,
        token_standard: resultTokenStandard,
        symbol: resultSymbol,
      } = result.content.metadata;
      name = resultName;
      description = resultDescription;
      token_standard = resultTokenStandard;
      symbol = resultSymbol;
    } else {
      name = undefined;
      description = undefined;
      token_standard = undefined;
      symbol = undefined;
    }

    tokenImage = result.content ? result.content.links : undefined;

    if (result.creators && result.creators[0]) {
      creatorAddress = result.creators[0].address;
    } else {
      creatorAddress = undefined;
    }

    if (result.authorities && result.authorities[0]) {
      uA = result.authorities[0].address;
      scopes = result.authorities[0].scopes;
    } else {
      uA = undefined;
      scopes = undefined;
    }

    ownerRenounced = result.ownership ? result.ownership.delegated : undefined;

    if (result.token_info) {
      supply = result.token_info.supply / 10 ** result.token_info.decimals;
      decimals = result.token_info.decimals;
      price = result.token_info.price_info
        ? result.token_info.price_info.price_per_token
        : undefined;
      fdmc = price ? price * supply : undefined;
    } else {
      supply = undefined;
      decimals = undefined;
      price = undefined;
      fdmc = undefined;
    }

    // Construct token data object
    const tokenData = {
      id: id,
      mutable: mutable,
      burnt: burnt,
      tokenName: name,
      description: description,
      tokenStandard: token_standard,
      tokenSymbol: symbol,
      tokenImage: tokenImage,
      creatorAddress: creatorAddress,
      uA: uA,
      scopes: scopes,
      ownerRenounced: ownerRenounced,
      supply: supply,
      decimals: decimals,
      price: price,
      // currency: currency,
      fdmc: fdmc,
    };

    console.log("tokenDataFinal:", tokenData);
    return tokenData;
  } catch (error) {
    console.log(error, "Failure to get data");
    throw error;
  }
}

// get Address and process from frontEnd

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const body = await req.json();

      const { address } = body;

      const responseData = await getFirstData(address);

      return new Response(JSON.stringify(responseData));
    } catch (error) {
      console.log(error, "Failure to get Address data from FrontEnd!");
    }
    // Return an error response
    return new Response(JSON.stringify({ error: "Failed to get Data" }));
  } else {
    // Return a 405 Method Not Allowed response if the method is not POST
    return new Response(JSON.stringify({ error: "Method not allowed" }));
  }
}
