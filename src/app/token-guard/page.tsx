"use client";
import React, { useState, useEffect } from "react";
import { getTokenBadge } from "@/components/utils/getTokensMetadata";

import TokenInfo from "../../components/ui/tokenInfo";

const WalletGuard = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | any>(null);
  const [success, setSuccess] = useState<string | any>(null);

  const [data, setData] = useState<any[] | any>("");
  const [showModal, setShowModal] = useState<Boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

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

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 20000);

    try {
      const addressAnalysisResponse = await fetch("/api/address", {
        method: "POST",
        body: JSON.stringify({
          address: address,
        }),
      });

      if (addressAnalysisResponse.ok) {
        const responseData = await addressAnalysisResponse.json();
        const verifiedBadge = await getTokenBadge(address);

        setVerified(verifiedBadge);
        setData(responseData);
        setError(null);
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
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [success]);

  useEffect(() => {
    if (success) {
      const timeout: any = setTimeout(() => {
        setData("");
      }, 60000);

      return () => clearTimeout(timeout);
    }
  }, [success]);

  return (
    <section className="relative  mb-40 bg-white">
      <div
        className="absolute inset-0 top-1/2 md:mt-24 lg:mt-0 pointer-events-none"
        aria-hidden="true"
      ></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 font-semibold mb-4 mt-12">Token Guard</h2>
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
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition-opacity ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span className="flex items-center gap-1">
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
                    Analyzing
                  </>
                ) : (
                  "Analyze"
                )}
              </span>
            </button>
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
                  <TokenInfo tokenData={data} verified = {verified} />
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
