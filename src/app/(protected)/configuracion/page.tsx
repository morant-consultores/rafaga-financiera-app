import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";
import ConfiguracionGeneral from "./general-settings";

interface Props {}

const Configuracion: FC<Props> = (props): JSX.Element => {
  return (
    <Tabs defaultValue="general-settings" className="p-4">
      <TabsList className="mb-4">
        <TabsTrigger value="general-settings">
          Configuración General
        </TabsTrigger>
        <TabsTrigger value="notification-phones">
          Teléfonos de Notificación
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general-settings">
        <ConfiguracionGeneral />
      </TabsContent>
      <TabsContent value="notification-phones"></TabsContent>
    </Tabs>
  );
};

export default Configuracion;
