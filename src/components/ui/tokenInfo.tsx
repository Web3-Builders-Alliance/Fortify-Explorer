import React, { useState } from "react";
import { FaBolt } from "react-icons/fa";
import Image from "next/image";

interface TokenInfoProps {
  tokenData: any;
  totalLiquidityValue: any;
}

const TokenInfo: React.FC<TokenInfoProps> = ({
  tokenData,
  totalLiquidityValue,
}) => {
  const {
    id,
    mutable,
    burnt,
    tokenName,
    description,
    tokenStandard,
    tokenSymbol,
    tokenImage,
    creatorAddress,
    uA,
    scopes,
    ownerRenounced,
    supply,
    decimals,
    price,
    currency,
    fdmc,
  } = tokenData;

  const image = tokenImage.image;

  const shortenAddress = (address: any) => {
    if (!address) return "";
    const length = address.length;
    const prefix = address.slice(0, 5);
    const suffix = address.slice(length - 5, length);
    return `${prefix}....${suffix}`;
  };

  return (
    <div className="flex flex-col gap-y-2 border-2 bg-[#000434]  rounded-2xl divide-y  divide-blue-600/50 divide-solid shadow-2xl ">
      <div className="flex flex-row lg:gap-4 lg:mx-12 items-center py-8  text-white   text-xs md:text-lg ">
        <div className="m-3">
          <img
            src={image}
            alt="card-image"
            className="block object-cover w-16 h-16  sm:w-26 sm:h-26  md:w-32 md:h-32 rounded-full shadow-2xl"
          />
        </div>
        <div className="flex flex-col items-center  lg:items-start gap-y-4 font-semibold h-full">
          <h2>
            {tokenName} <span>&bull;</span> {tokenSymbol}
          </h2>

          <p className="flex text-white/60">
            Description: {description || tokenName}
          </p>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col px-3 sm:px-7 py-4 gap-4 gap-x-2 justify-center text-white/80">
        <div className="flex flex-col divide-y  md:w-1/2 h-320 border-2  border-red-600 rounded p-3 sm:p-4">
          <h2 className="font-bold text-center pb-2 text-sm lg:text-lg ">
            Token Market Data
          </h2>
          <div className="flex flex-col gap-1 divide-y divide-green-600 py-2">
            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between ">
              <p>Current Price</p>
              <p>${price}</p>
            </div>

            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between ">
              <p>Token Address</p>
              <p>
                <a
                  href={`https://solscan.io/token/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortenAddress(id)}
                </a>
              </p>
            </div>
            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between ">
              <p>Token Standard</p>
              <p>{tokenStandard}</p>
            </div>
            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-1">
              <p>Decimals</p>
              <p>{decimals}</p>
            </div>

            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-1">
              <p>Total Supply</p>
              <p>
                {supply.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>

            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-1">
              <p>Fully Diluted Market Cap</p>
              <p>
                $
                {fdmc.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>

            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-1">
              <p>Liquidity</p>
              <p>
                $
                {totalLiquidityValue.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col divide-y  md:w-1/2 h-320 border-2  border-red-600 rounded p-3 sm:p-4">
          <h2 className="font-bold text-center pb-2 text-sm lg:text-lg ">
            Fortify Security
          </h2>
          <div className="flex flex-col gap-1 divide-y divide-green-600 sm:p-2">
            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-2">
              <div className="flex items-center  flex-row gap-1 ">
                <span className="w-4 h-4">
                  <FaBolt />
                </span>

                <p>Mint Address</p>
              </div>
              <p className="text-blue-600">
                <a
                  href={`https://solscan.io/token/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortenAddress(id)}
                </a>
              </p>
            </div>

            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-2">
              <div className="flex items-center  flex-row gap-1 ">
                <span className="w-4 h-4">
                  <FaBolt />
                </span>
                <p>Creator</p>
              </div>
              <p className="text-blue-600">
                <a
                  href={`https://solscan.io/token/${creatorAddress || uA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortenAddress(creatorAddress || uA)}
                </a>
              </p>
            </div>

            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-2">
              <div className="flex items-center  flex-row gap-1 ">
                <span className="w-4 h-4">
                  <FaBolt />
                </span>
                <p>Update Authority</p>
              </div>
              <p className="text-blue-600">
                <a
                  href={`https://solscan.io/token/${uA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortenAddress(uA)}
                </a>
              </p>
            </div>

            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-2">
              <div className="flex items-center  flex-row gap-1 ">
                <span className="w-4 h-4">
                  <FaBolt />
                </span>
                <p>Mintable</p>
              </div>

              <p className={ownerRenounced ? "text-red-500" : "text-green-500"}>
                {ownerRenounced ? "Yes" : "No"}{" "}
                <i className="fa fa-times-circle-o" aria-hidden="true"></i>
              </p>
            </div>

            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-2">
              <div className="flex items-center  flex-row gap-1 ">
                <span className="w-4 h-4">
                  <FaBolt />
                </span>
                <p>Mutable</p>
              </div>

              <p className={mutable ? "text-red-500" : "text-green-500"}>
                {mutable ? "Yes" : "No"}{" "}
                <i className="fa fa-times-circle-o" aria-hidden="true"></i>
              </p>
            </div>

            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-2">
              <div className="flex items-center  flex-row gap-1 ">
                <span className="w-4 h-4">
                  <FaBolt />
                </span>
                <p>Burnt</p>
              </div>
              <p className="text-blue-600">
                {burnt ? "Yes" : "No"}{" "}
                <i className="fa fa-times-circle-o" aria-hidden="true"></i>
              </p>
            </div>

            {/* <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-2">
              <div className="flex items-center  flex-row gap-1 ">
                <span className="w-4 h-4">
                  <FaBolt />
                </span>
                <p>Freezable</p>
              </div>
              <p className="text-red-700">
                No <i className="fa fa-times-circle-o" aria-hidden="true"></i>
              </p>
            </div> */}

            <div className="font-semibold text-xs lg:text-lg flex flex-row justify-between pt-2">
              <div className="flex items-center  flex-row gap-1 ">
                <span className="w-4 h-4">
                  <FaBolt />
                </span>
                <p>Ownership Renounced</p>
              </div>
              <p className={ownerRenounced ? "text-red-500" : "text-green-500"}>
                {ownerRenounced ? "No" : "Yes"}{" "}
                <i className="fa fa-times-circle-o" aria-hidden="true"></i>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col text-sm lg:text-lg justify-start px-7 py-4 gap-2">
        <div className="text-left text-white/80 font-extrabold font-24">
          <h2>AI GPT Agent Insight</h2>
        </div>

        <div className="w-full font-semibold border-2  border-gray-300 rounded">
          <p className="text-left text-white/80 p-4">
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
            reiciendis vitae laborum quos corrupti odio eius sed in, cumque
            suscipit aut ullam debitis, nihil totam adipisci, recusandae
            maiores? Reprehenderit, voluptatibus!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
