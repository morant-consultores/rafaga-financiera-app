"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { createClient } from "@/utils/supabase/client";

type ChartConfigEntry = {
  label: string;
  color?: string;
};

type ChartConfigType = {
  [key: string]: ChartConfigEntry;
};

const chartConfig: ChartConfigType = {
  views: {
    label: "Mensajes",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  conversacion: {
    label: "Diálogo",
    color: "hsl(var(--chart-2))",
  },
  cartaAcuerdo: {
    label: "Carta Acuerdo",
    color: "hsl(var(--chart-3))",
  },
  manualInscritos: {
    label: "Manual Inscritos",
    color: "hsl(var(--chart-4))",
  },
};

export function BotLogsChart() {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("total");
  const [total, setTotal] = React.useState<Record<string, number>>({});
  const supabase = createClient();

  React.useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const startOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      const endOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      const nextMonth = new Date(endOfCurrentMonth);
      nextMonth.setDate(nextMonth.getDate() + 1);

      const { data, error } = await supabase
        .from("bot_logs")
        .select("*")
        .gte("created_at", startOfCurrentMonth.toISOString())
        .lt("created_at", nextMonth.toISOString());

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      const dailyData: Record<string, any> = {};

      const getLocalDate = (dateString: string) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1); // Adelantamos un día
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Inicializar todos los días del mes (y uno extra)
      const extraDay = new Date(endOfCurrentMonth);
      extraDay.setDate(extraDay.getDate() + 1);

      for (
        let d = new Date(startOfCurrentMonth);
        d <= extraDay;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = getLocalDate(d.toISOString());
        dailyData[dateStr] = {
          date: dateStr,
          total: 0,
          conversacion: 0,
          cartaAcuerdo: 0,
          manualInscritos: 0,
        };
      }

      // Procesar los datos
      data.forEach((log) => {
        const date = getLocalDate(log.created_at);
        if (dailyData[date]) {
          dailyData[date].total++;
          if (log.function_name === "contestar_dudas")
            dailyData[date].conversacion++;
          if (log.function_name === "enviar_carta_acuerdo")
            dailyData[date].cartaAcuerdo++;
          if (log.function_name === "enviar_manual_inscritos")
            dailyData[date].manualInscritos++;
        } else {
          console.warn(`No se encontró entrada para la fecha ${date}`);
        }
      });

      console.log(dailyData);

      const chartData = Object.values(dailyData);
      chartData.pop();
      setChartData(chartData);

      const totals = {
        total: chartData.reduce((acc, curr) => acc + curr.total, 0),
        conversacion: chartData.reduce(
          (acc, curr) => acc + curr.conversacion,
          0
        ),
        cartaAcuerdo: chartData.reduce(
          (acc, curr) => acc + curr.cartaAcuerdo,
          0
        ),
        manualInscritos: chartData.reduce(
          (acc, curr) => acc + curr.manualInscritos,
          0
        ),
      };
      setTotal(totals);
    };

    fetchData();

    const subscription = supabase
      .channel("bot_logs_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bot_logs" },
        fetchData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total de Mensajes</CardTitle>
          <CardDescription>Mostrando datos para el mes actual</CardDescription>
        </div>
        <div className="flex flex-wrap">
          {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>)
            .filter((key) => key !== "views")
            .map((key) => (
              <button
                key={key}
                data-active={activeChart === key}
                className="relative z-30 flex flex-1 flex-col items-center justify-center gap-1 border-t px-6 py-4 text-center even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key]?.toLocaleString() || 0}
                </span>
              </button>
            ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-MX", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-MX", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={chartConfig[activeChart].color || "hsl(var(--chart-1))"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default BotLogsChart;
