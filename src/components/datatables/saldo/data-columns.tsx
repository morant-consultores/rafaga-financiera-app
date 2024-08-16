"use client";

import { DeleteSaldoDialog } from "@/components/saldo/saldo-delete-dialog";
import ComprobanteSaldoBtn from "@/components/saldo/ver-comprobante";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export type SaldoBot = {
  id: string;
  created_at: string;
  monto: number;
  notas: string | null;
  file_path: string;
};

export const columns: ColumnDef<SaldoBot>[] = [
  {
    accessorKey: "created_at",
    header: () => <div className="text-center">Fecha</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Mexico_City",
        day: "numeric",
        month: "short",
        year: "numeric",
      };
      const formatted = date.toLocaleDateString("es-MX", options);
      const [day, month, year] = formatted.split(" ");
      const formattedDate = `${day} ${
        month.charAt(0).toUpperCase() + month.slice(1)
      } ${year}`;

      return (
        <div className="text-center lg:min-w-[120px] text-sm">
          {formattedDate}
        </div>
      );
    },
  },
  {
    accessorKey: "monto",
    header: () => <div className="text-center">Monto (USD)</div>,
    cell: ({ row }) => {
      const monto = parseFloat(row.getValue("monto"));
      const formatted = monto.toFixed(2);
      return <div className="text-center text-sm">${formatted}</div>;
    },
  },
  {
    accessorKey: "notas",
    header: () => <div className="text-center">Notas</div>,
    cell: ({ row }) => {
      const notas = row.getValue("notas") as string;
      return <div className="text-center text-sm">{notas}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[160px] space-y-2 bg-white border-2 z-10 rounded-md"
          >
            <ComprobanteSaldoBtn file_path={row.original.file_path}/>
            <DeleteSaldoDialog id={row.original.id} filePath={row.original.file_path}/>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
