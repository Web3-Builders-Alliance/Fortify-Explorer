"use client";
import React from "react";
import { FC, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const ConnectWallet = ({ }) => {
  const { setVisible } = useWalletModal();
  const { wallet, connect, connecting, publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey && wallet) {
      try {
        connect();
      } catch (error) {
        console.log("Error connecting to the wallet: ", (error as any).message);
      }
    }
  }, [wallet]);

  // const handleWalletClick = () => {
  //   try {
  //     if (!wallet) {
  //       setVisible(true);
  //     } else {
  //       connect();
  //     }
     
  //   } catch (error) {
  //     console.log("Error connecting to the wallet: ", (error as any).message);
  //   }
  // };

  return null;
};

export default ConnectWallet;
