"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ShortenAddress } from "../utils/addressUtil";

export type Transactions = {
  signature: string | any;
  time: string;
  instruction: string;
  by: string | any;
  fee: number;
};

export type TokenType = {
  name: string;
  tokenaddress: string | any;
  balance: number;
  price: number;
  value: number;
};

export const trxColumns :ColumnDef<Transactions>[] = [

  
    {
      accessorKey: "signature",
      header: "Signature",
      cell: ({ row }) => (
        <ShortenAddress
          addressType="signature"
          address={row.original.signature}
        />
      ),
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      accessorKey: "instruction",
      header: "Instruction",
    },
    {
      accessorKey: "by",
      header: "By",
      cell: ({ row }) => (
        <ShortenAddress addressType="by" address={row.original.by} />
      ),
    },
    {
      accessorKey: "fee",
      header: "Fee",
    },
  ];


export const tokensColumns: ColumnDef<TokenType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "tokenaddress",
    header: "token Address",
    cell: ({ row }) => (
      <ShortenAddress
        addressType="tokenaddress"
        address={row.original.tokenaddress}
      />
    ),
  },
  {
    accessorKey: "balance",
    header: "Balance",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
];
