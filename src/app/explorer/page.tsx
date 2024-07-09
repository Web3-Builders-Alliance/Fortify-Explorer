"use client";
import React, { useState } from "react";
import Analysis from "./[inputPub]/page";
import Link from "next/link";
import {
  FaSearchDollar,
  FaFighterJet,
  FaBatteryFull,
  FaSearch,
} from "react-icons/fa";
import Searchbar from "@/components/ui/searchbar";

const Page = () => {
  const [resultAnalysis, setResultAnalysis] = useState<any>({});

  const updateState = (data: any) => {
    if (data) {
      setResultAnalysis(data);
    } else {
      setResultAnalysis({});
    }
  };

  return (
    <div>
      {Object.keys(resultAnalysis).length === 0 ? (
        <section className="flex flex-col gap-32 mt-20 pt-20 mb-64 mx-12 md:mx-24 h-full bg-[#000434]">
          <div className="flex flex-col w-full">
            <div className="flex flex-col text-center mx-4 gap-7">
              <h2 className="flex items-center justify-start text-3xl lg:text-4xl font-black text-white">
                The User Security Explorer
              </h2>

              <Searchbar className="h-20 w-full" updateState={updateState} />

              <div className="w-full flex flex-col justify-center sm:mt-20 items-center">
                <ul className="w-full lg:w-3/4 mt-20 gap-16 flex bg-[#33365d]/10 flex-col p-5 sm:p-8 rounded-tr-3xl rounded-br-3xl shadow-2xl border border-[#34d4f7]/60">
                  <li className="flex gap-5 sm:gap-8 items-center">
                    <span className="text-4xl mt-8 sm:text-6xl">
                      <FaSearchDollar className="border-4 rounded-lg p-1 sm:p-3 border-red-300 fill-red-300" />
                    </span>
                    <div className="flex flex-col text-start gap-3 w-96 lg:w-full sm:w-[480px]">
                      <h2 className="sm:text-xl font-bold text-green-600">
                        Quick Scan
                      </h2>
                      <p className="flex w-full text-sm sm:text-base text-gray-300">
                        Conduct a scan and get the details of everything
                        happening in your wallet
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-5 sm:gap-8 items-center">
                    <span className="text-4xl mt-8 sm:text-6xl">
                      <FaFighterJet className="border-4 rounded-lg p-1 sm:p-3 border-red-300 fill-red-300" />
                    </span>
                    <div className="flex flex-col text-start gap-3 w-96 lg:w-full sm:w-[480px]">
                      <h2 className="sm:text-xl font-bold text-green-600">
                        Easy to Use
                      </h2>
                      <p className="text-sm sm:text-base text-gray-300">
                        Get started by just pasting your address and the
                        scanning process will start. Connect wallet only when
                        you want to take action!
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-5 sm:gap-8 items-center">
                    <span className="text-4xl mt-8 sm:text-6xl">
                      <FaBatteryFull className="border-4 rounded-lg p-1 sm:p-3 border-red-300 fill-red-300" />
                    </span>
                    <div className="flex flex-col text-start gap-3 w-96 lg:w-full sm:w-[480px]">
                      <h2 className="sm:text-xl font-bold text-green-600">
                        Get Fortified Immediately
                      </h2>
                      <p className="text-sm sm:text-base text-gray-300">
                        You can take action Immediately to revoke token
                        approvals, burn unnecessary tokens and so much more in
                        an instant
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <Analysis updateState={updateState} analysisData={resultAnalysis} />
      )}
    </div>
  );
};

export default Page;
