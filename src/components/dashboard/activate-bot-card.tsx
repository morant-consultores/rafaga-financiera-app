'use client'

import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Skeleton } from "../ui/skeleton";
import { createClient } from "@/utils/supabase/client";

interface Props {}

const ActivarDesactivarBotCard: FC<Props> = (props): JSX.Element => {
  const [isBotActive, setIsBotActive] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchInitialBotState = async () => {
      const { data, error } = await supabase
        .from('config_settings')
        .select('bot_active')
        .single();

      if (error) {
        console.error('Error fetching bot state:', error);
      } else if (data) {
        setIsBotActive(data.bot_active);
      }
    };

    fetchInitialBotState();

    const subscription = supabase
      .channel('config_settings_changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'config_settings',
          filter: 'id=eq.1'
        }, 
        (payload) => {
          setIsBotActive(payload.new.bot_active);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase]);

  const handleToggle = async () => {
    if (isBotActive === null) return;
    const newState = !isBotActive;
    const { error } = await supabase
      .from('config_settings')
      .update({ bot_active: newState })
      .eq('id', 1);

    if (error) {
      console.error('Error updating bot state:', error);
    }
  };

  if (isBotActive === null) {
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
        <CardTitle className="text-sm font-medium">Chatbot</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 space-y-1">
            <div className="text-2xl font-bold">Estado del Bot</div>
            <p className="text-xs text-muted-foreground">
              Gestione la activación del asistente virtual
            </p>
          </div>
          <Switch 
            checked={isBotActive}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivarDesactivarBotCard;