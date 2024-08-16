"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Log = {
  id: string;
  created_at: string;
  from_phone: string;
  user_text: string;
  assistant_text: string;
  input_tokens: number;
  output_tokens: number;
  input_cost_usd: number;
  output_cost_usd: number;
  function_name: string;
};

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "created_at",
    header: () => <div className="text-center">Fecha</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formatted = date.toLocaleString();
      return <div className="text-left min-w-[180px] text-sm">{formatted}</div>;
    },
  },
  {
    accessorKey: "from_phone",
    header: () => <div className="text-center">Teléfono</div>,
    cell: ({ row }) => {
      const phone = row.getValue("from_phone") as string;
      const formattedPhone = phone.replace(/^521/, "").split("@")[0];
      return <div className="text-left text-sm">{formattedPhone}</div>;
    },
  },
  {
    accessorKey: "input_tokens",
    header: () => <div className="text-center">Input Tokens</div>,
    cell: ({ row }) => {
      const tokens = row.getValue("input_tokens") as number;
      return <div className="text-center text-sm">{tokens.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "output_tokens",
    header: () => <div className="text-right">Output Tokens</div>,
    cell: ({ row }) => {
      const tokens = row.getValue("output_tokens") as number;
      return <div className="text-center text-sm">{tokens.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "input_cost_usd",
    header: () => <div className="text-center">Costo de input (USD)</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("input_cost_usd"));
      const formatted = amount.toFixed(4);
      return <div className="text-center text-sm">${formatted}</div>;
    },
  },
  {
    accessorKey: "output_cost_usd",
    header: () => <div className="text-center">Costo de output (USD)</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("output_cost_usd"));
      const formatted = amount.toFixed(4);
      return <div className="text-center text-sm">${formatted}</div>;
    },
  },
  {
    accessorKey: "total_cost_usd",
    header: () => <div className="text-center">Costo Total (USD)</div>,
    cell: ({ row }) => {
      const inputCost = parseFloat(row.getValue("input_cost_usd"));
      const outputCost = parseFloat(row.getValue("output_cost_usd"));
      const totalCost = inputCost + outputCost;
      const formatted = totalCost.toFixed(4);
      return <div className="text-center text-sm">${formatted}</div>;
    },
  },
  {
    accessorKey: "function_name",
    header: () => <div className="text-center">Nombre de la función</div>,
    cell: ({ row }) => {
      const functionName = row.getValue("function_name") as string;
      return <div className="text-center text-sm">{functionName}</div>;
    },
  },
];
