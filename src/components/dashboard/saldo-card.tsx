'use client'

import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { createClient } from "@/utils/supabase/client";

interface Props {}

const SaldoCard: FC<Props> = (props): JSX.Element => {
  const [balance, setBalance] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchInitialBalance = async () => {
      const { data, error } = await supabase
        .from('system_balance')
        .select('balance_usd')
        .single();

      if (error) {
        console.error('Error fetching balance:', error);
      } else if (data) {
        setBalance(data.balance_usd);
      }
    };

    fetchInitialBalance();

    const subscription = supabase
      .channel('system_balance_changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'system_balance',
        }, 
        (payload) => {
          setBalance(payload.new.balance_usd);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase]);

  if (balance === null) {
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
        <CardTitle className="text-sm font-medium">Saldo del Sistema</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-1">
          <div className="text-2xl font-bold">${balance.toFixed(2)} USD</div>
          <p className="text-xs text-muted-foreground">
            Saldo actual del sistema
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaldoCard;