"use client";

import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { createClient } from "@/utils/supabase/client";
import { PlusCircle } from "lucide-react";
import { DataTable } from "../datatables/info/data-table";
import { columns, TextoRafaga } from "../datatables/info/data-columns";
import TextoRafagaDialog from "./info-dialog";

interface Props {}

const InfoRafagaCard: FC<Props> = (): JSX.Element => {
  const [textosCount, setTextosCount] = useState<number | null>(null);
  const [textosData, setTextosData] = useState<TextoRafaga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTextosData = async () => {
      setIsLoading(true);
      const { data, count, error } = await supabase
        .from("textos_rafaga")
        .select("id, created_at, titulo", { count: "exact" })
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching textos data:", error);
      } else {
        setTextosData(data as TextoRafaga[]);
        setTextosCount(count);
      }
      setIsLoading(false);
    };

    fetchTextosData();

    const subscription = supabase
      .channel("textos_rafaga_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "textos_rafaga",
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
      <Card className="space-y-1">
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
            <CardTitle className="text-sm font-medium">Textos Ráfaga</CardTitle>
            <p className="text-xs text-muted-foreground">
              {textosCount} Textos ráfaga disponibles
            </p>
          </div>
          <div className="flex items-center justify-center">
            <TextoRafagaDialog>
              <Button
                variant="ghost"
                className="rounded-full hover:bg-green-50"
                size="icon"
              >
                <PlusCircle className="h-full w-full text-green-500" />
              </Button>
            </TextoRafagaDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        <DataTable columns={columns} data={textosData} />
      </CardContent>
    </Card>
  );
};

export default InfoRafagaCard;
