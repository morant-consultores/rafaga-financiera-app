import SaldoCard from "@/components/dashboard/saldo-card";
import AgregarSaldoCard from "@/components/saldo/agregar-saldo-card";
import SaldoTableCard from "@/components/saldo/saldo-card";
import { FC } from "react";

interface Props {}

const Page: FC<Props> = (props): JSX.Element => {
  return (
    <div className="flex flex-col h-full">
      <div className="space-y-2 p-4">
        <h2 className="text-2xl font-medium">Saldo del bot</h2>
        <p className="text-muted-foreground">
          Aquí puedes agregar saldo al bot.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-4 p-2">
        <div className="space-y-4 flex flex-col">
          <SaldoCard />
          <AgregarSaldoCard />
        </div>
        <div className="grid lg:col-span-2">
          <SaldoTableCard />
        </div>
      </div>
    </div>
  );
};

export default Page;
