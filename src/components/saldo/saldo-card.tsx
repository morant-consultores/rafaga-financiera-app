"use client";

import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { createClient } from "@/utils/supabase/client";
import { columns, SaldoBot } from "../datatables/saldo/data-columns";
import { DataTable } from "../datatables/saldo/data-table";

interface Props {}

const SaldoTableCard: FC<Props> = (): JSX.Element => {
  const [saldoData, setSaldoData] = useState<SaldoBot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTextosData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("saldo_bot")
        .select("id, created_at, monto, notas, file_path")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching textos data:", error);
      } else {
        setSaldoData(data as SaldoBot[]);
      }
      setIsLoading(false);
    };

    fetchTextosData();

    const subscription = supabase
      .channel("saldo_bot_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "saldo_bot",
        },
        (payload) => {
          console.log("Change received!", payload);
          fetchTextosData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase]);

  if (isLoading) {
    return (
      <Card className="space-y-1 min-h-[600px]">
        <CardHeader>
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-1/3" />
            </div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex justify-between">
                <Skeleton className="h-12 w-2/3" />
                <Skeleton className="h-12 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="space-y-1">
      <CardHeader>
        <div className="flex justify-between">
          <div className="space-y-2">
            <CardTitle className="text-sm font-medium">Registros</CardTitle>
            <p className="text-xs text-muted-foreground">
              Registros de comprobantes de aumento de saldo
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        <DataTable columns={columns} data={saldoData} />
      </CardContent>
    </Card>
  );
};

export default SaldoTableCard;
