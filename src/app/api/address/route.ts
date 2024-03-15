import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const rpc =
  "https://mainnet.helius-rpc.com/?api-key=90abe477-bdbe-4add-af28-800bf2ca2e04";
// for dev purposes only. will move to .env after testing 

const umi = createUmi(rpc).use(dasApi());

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log(body);
      const { address } = body;

      const tokenAddy = publicKey(address);

      const assetDetails = await umi.rpc.getAsset(tokenAddy);
      const responseData = await assetDetails;
      return new Response(JSON.stringify(responseData));
    } catch (error) {
      console.log(error, "Failure to get data");
    }
    // Return an error response
    return new Response(JSON.stringify({ error: "Failed to get Data" }));
  } else {
    // Return a 405 Method Not Allowed response if the method is not POST
    return new Response(JSON.stringify({ error: "Method not allowed" }));
  }
}
