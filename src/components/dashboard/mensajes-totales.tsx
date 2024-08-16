"use client";

import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { createClient } from "@/utils/supabase/client";

interface Props {}

const ConversacionesTotalesCard: FC<Props> = (): JSX.Element => {
  const [totalConversations, setTotalConversations] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchConversations = async () => {
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfPreviousPeriod = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 23, 59, 59, 999);

      // Función para contar conversaciones únicas
      const countConversations = (data: any[]) => {
        const conversations = new Set();
        data.forEach(log => {
          const logDate = new Date(log.created_at);
          const dateString = logDate.toISOString().split('T')[0];
          const key = `${log.from_phone}-${dateString}`;
          conversations.add(key);
        });
        return conversations.size;
      };

      // Fetch conversaciones del mes actual
      const { data: currentData, error: currentError } = await supabase
        .from("bot_logs")
        .select("from_phone, created_at")
        .gte("created_at", startOfCurrentMonth.toUTCString())
        .lte("created_at", endOfCurrentMonth.toUTCString());

      if (currentError) {
        console.error("Error fetching current month conversations:", currentError);
        return;
      }

      const currentConversations = countConversations(currentData);
      setTotalConversations(currentConversations);

      // Fetch conversaciones del mes anterior hasta la misma fecha
      const { data: previousData, error: previousError } = await supabase
        .from("bot_logs")
        .select("from_phone, created_at")
        .gte("created_at", startOfPreviousMonth.toUTCString())
        .lte("created_at", endOfPreviousPeriod.toUTCString());

      if (previousError) {
        console.error("Error fetching previous month conversations:", previousError);
        return;
      }

      const previousConversations = countConversations(previousData);

      // Calcular el porcentaje de cambio
      if (previousConversations > 0) {
        const change = ((currentConversations - previousConversations) / previousConversations) * 100;
        setPercentageChange(change);
        console.log("Porcentaje de cambio:", change);
      }
    };

    fetchConversations();

    // Suscripción a cambios en tiempo real
    const subscription = supabase
      .channel("bot_logs_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bot_logs",
        },
        fetchConversations
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase]);

  if (totalConversations === null) {
    return (
      <Card className="space-y-1">
        <CardHeader>
          <Skeleton className="h-5 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="space-y-1">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Conversaciones este mes</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-1">
          <div className="text-2xl font-bold">{totalConversations}</div>
          {percentageChange !== null && (
            <p className="text-xs text-muted-foreground">
              {percentageChange > 0 ? "+" : ""}
              {percentageChange.toFixed(2)}% respecto al mismo período del mes anterior
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversacionesTotalesCard;