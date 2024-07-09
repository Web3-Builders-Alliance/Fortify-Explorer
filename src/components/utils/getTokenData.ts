export interface TokenPriceProps {
  address: string;
}

export const tokenData = async (props: TokenPriceProps | any): Promise<any> => {
  try {
    const addressAnalysisResponse = await fetch("/api/address", {
      method: "POST",
      body: JSON.stringify({
        address: props.address,
      }),
    });

    if (addressAnalysisResponse.ok) {
      const responseData : any  = await addressAnalysisResponse.json();

      return responseData;
    } else {
      return "An error occurred while sending data to Metaplex";
    }
  } catch (error) {
    console.error("Error", error);
    return "An error occurred: " + (error as Error).message;;
  }
};
