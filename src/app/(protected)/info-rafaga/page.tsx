import CartaAcuerdoCard from "@/components/info-rafaga/carta-acuerdo-card";
import InfoRafagaCard from "@/components/info-rafaga/info-card";
import ManualCard from "@/components/info-rafaga/manual-card";
import { FC } from "react";

interface Props {}

const Page: FC<Props> = (props): JSX.Element => {
  return (
    <div className="flex flex-col h-full">
      <div className="space-y-2 p-4">
        <h2 className="text-2xl font-medium">Información Ráfaga</h2>
        <p className="text-muted-foreground">
          Aquí puedes editar la información con la que trabaja el chatbot.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-4 p-2">
        <div className="grid lg:col-span-2">
          <InfoRafagaCard />
        </div>
        <div className="space-y-2">
          <CartaAcuerdoCard />
          <ManualCard />
        </div>
      </div>
    </div>
  );
};

export default Page;
