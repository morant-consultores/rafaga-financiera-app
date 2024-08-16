"use client";

import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  columns,
  Log,
} from "@/components/datatables/logs-chatbot/data-columns";
import { DataTable } from "@/components/datatables/logs-chatbot/data-table";

const LogsChatbot: FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchInitialLogs = async () => {
      const { data, error } = await supabase
        .from("bot_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2000);

      if (error) {
        console.error("Error fetching bot logs:", error);
      } else if (data) {
        setLogs(data);
      }
    };

    fetchInitialLogs();

    const subscription = supabase
      .channel("bot_logs_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bot_logs",
        },
        (payload) => {
          setLogs((currentLogs) =>
            [payload.new as Log, ...currentLogs].slice(0, 2000)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase]);

  return (
    <div>
      <div className="mb-8 space-y-2 p-4">
        <h2 className="text-2xl font-medium">Logs de Chatbot</h2>
        <p className="text-muted-foreground">
          Aquí puedes ver en tiempo real el uso del chatbot.
        </p>
      </div>
      <DataTable columns={columns} data={logs}></DataTable>
    </div>
  );
};

export default LogsChatbot;
