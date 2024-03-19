"use client";
import React, { useState, useEffect } from "react";

import TokenInfo from "../../components/ui/tokenInfo";

interface Data {
  tokenData: any;
  totalLiquidityValue: any;
}

const WalletGuard = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | any>(null);
  const [success, setSuccess] = useState<string | any>(null);
  const initialData: Data = { tokenData: {}, totalLiquidityValue: {} };
  const [data, setData] = useState<Data>(initialData);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleSubmit = async () => {
    if (!address.trim()) {
      setError("Please enter a valid address !");
      return;
    }

    setLoading(true); // Set loading to true on button click

    try {
      const addressAnalysisResponse = await fetch("/api/address", {
        method: "POST",
        body: JSON.stringify({
          address: address,
        }),
      });
      console.log("Address Analyzed", addressAnalysisResponse.formData);

      if (addressAnalysisResponse.ok) {
        const responseData = await addressAnalysisResponse.json();
        console.log("Token Data Retrived", responseData);
        // const res = responseData.json
        setData(responseData);
        setError(null); // Clear error if submission is successful
        toggleModal();
        setAddress("");
        setSuccess("Created Successfully!");
      } else {
        // Handle error response
        setError("An error occurred while sending data to Metaplex");
      }

      setLoading(false); // Set loading to false after processing

      // Clear error if submission is successful
      setError(null);
      setSuccess("Processing successful!");
    } catch (error) {
      console.error("Error", error);
      setError("An error occurred while processing the address");
    }
  };

  useEffect(() => {
    if (error) {
      const timeout: any = setTimeout(() => {
        setError(null);
      }, 8000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timeout: any = setTimeout(() => {
        setSuccess(null);
      }, 8000);

      return () => clearTimeout(timeout);
    }
  }, [success]);

  useEffect(() => {
    if (success) {
      const timeout: any = setTimeout(() => {
        setData(initialData);
      }, 20000);

      return () => clearTimeout(timeout);
    }
  }, [success]);

  return (
    <section className="relative mt-24 mb-40">
      <div
        className="absolute inset-0 top-1/2 md:mt-24 lg:mt-0 pointer-events-none"
        aria-hidden="true"
      ></div>
      <div className="absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4 mt-12">Wallet Guard</h2>
            <p className="text-xl font-medium text-gray-600">
              Get Detailed Information about any token on Solana. We will help
              you understand the technical details of the token.
            </p>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center my-12">
              <label htmlFor="tokenAddress" className="sr-only">
                Token Address
              </label>
              <input
                required
                id="tokenAddress"
                name="tokenAddress"
                type="text"
                placeholder="Enter Token Address"
                value={address}
                onChange={handleChange}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition-opacity ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading && (
                  <i
                    className="animate-spin fa fa-spinner"
                    aria-hidden="true"
                  ></i>
                )}
                {loading ? " Analysing" : "Analyse"}{" "}
                {/* Change button text based on loading state */}
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            {showModal && (
              <div className="block fixed z-50  top-0 left-0  h-full overflow-auto ">
                <div className="bg-white m-auto relative p-5 ">
                  <span
                    className="flex absolute text-white right-4 cursor-pointer justify-end px-5 py-2 text-5xl font-normal "
                    onClick={toggleModal}
                  >
                    &times;
                  </span>
                  <TokenInfo
                    tokenData={data.tokenData}
                    totalLiquidityValue={data.totalLiquidityValue}
                  />
                </div>
              </div>
            )}

            {/* <div className="text-sm max-w-6xl mx-auto sm:px-6">
              {Object.entries(data).map(([key, value]) => (
                <div key={key}>
                  <p>
                    {key}: {JSON.stringify(value)}
                  </p>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WalletGuard;
