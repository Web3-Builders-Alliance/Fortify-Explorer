"use client";
import Image from "next/image";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NftData {
  amount: number;
  logoURI: any;
  mint: string;
  name: string;
  tokenAccount: string;
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | any[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border sm:p-8 shadow-2xl  bg-[#33365d]/20  border-[#34d4f7]/60">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="font-medium "
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export const NftDataTable = ({ data }: { data: NftData[] }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 ">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-col min-w-32 px-2 py-3 gap-4 lg:p-12 bg-[#33365d]/20 border rounded-xl border-[#34d4f7]/20"
        >
          <span>
            <img
              className="w-fit"
              src={item.logoURI}
              alt="nft-image"
              width="500"
              height="500"
            />
          </span>
          <h2 className="font-medium text-xs lg:text-base">{item.name}</h2>
        </div>
      ))}
    </div>
  );
};
