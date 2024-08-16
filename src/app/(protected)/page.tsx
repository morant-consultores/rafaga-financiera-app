import ActivarDesactivarBotCard from "@/components/dashboard/activate-bot-card";
import ConversacionesTotalesCard from "@/components/dashboard/mensajes-totales";
import BotLogsChart from "@/components/dashboard/mensajes-totales-chart";
import SaldoCard from "@/components/dashboard/saldo-card";

export default function Home() {
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
        <ActivarDesactivarBotCard />
        <SaldoCard />
        <ConversacionesTotalesCard />
      </div>
      <div className="grid">
        <BotLogsChart />
      </div>
    </div>
  );
}
