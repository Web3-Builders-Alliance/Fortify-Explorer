"use client";
import React, { createContext, useContext, useState } from "react";

type AnalysisProps = {
  tokenHoldings?: any[];
  revokeData?: any[];
  nftNumber?: number;
  nfts?: any[];
  strictLists?: any[];
  strictNum?: number;
  unMatched?: any[];
  unMatchedNum?: number;
  revokeNum?: number;
  unknownNft?: any[];
  unknownNftNum?: number;
  unknownTokenNum?: number;
  validNftNum?: number;
  unknownToken?: any[];
  validNft?: any[];
};

interface ExploreContextType {
  state: {
    analysisProps: AnalysisProps;
  };
  setState: React.Dispatch<
    React.SetStateAction<{ analysisProps: AnalysisProps }>
  >;
}

const ExploreContext = createContext<ExploreContextType | undefined>(undefined);

export const ExploreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  
  const [state, setState] = useState<{ analysisProps: AnalysisProps }>({
    analysisProps: {},
  });

  return (
    <ExploreContext.Provider value={{ state, setState }}>
      {children}
    </ExploreContext.Provider>
  );
};

export const useExploreContext = () => {
  const context = useContext(ExploreContext);
  if (!context) {
    throw new Error("useExploreContext must be used within an ExploreProvider");
  }
  return context;
};
