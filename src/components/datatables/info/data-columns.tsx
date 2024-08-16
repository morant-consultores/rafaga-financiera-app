"use client";

import { DeleteAlertDialog } from "@/components/info-rafaga/info-delete-dialog";
import TextoRafagaDialog from "@/components/info-rafaga/info-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export type TextoRafaga = {
  id: string;
  created_at: string;
  titulo: string;
  texto: string;
  embedding: number;
};

export const columns: ColumnDef<TextoRafaga>[] = [
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
        <div className="text-left lg:min-w-[120px] text-sm">{formattedDate}</div>
      );
    },
  },
  {
    accessorKey: "titulo",
    header: () => <div className="text-center">Título</div>,
    cell: ({ row }) => {
      const titulo = row.getValue("titulo") as string;
      return <div className="text-left text-sm">{titulo}</div>;
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
            <TextoRafagaDialog id={row.original.id}>
              <Button
                variant="ghost"
                className="w-full flex justify-start px-2 font-normal"
              >
                Editar
              </Button>
            </TextoRafagaDialog>
            <DeleteAlertDialog id={row.original.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
