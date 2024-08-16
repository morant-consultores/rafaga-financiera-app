import { FC } from "react";
import MenuTitle from "./menu-title";
import MenuItem from "./menu-item";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const MainMenu: FC<Props> = ({ className }): JSX.Element => {
  return (
    <div className={cn("overflow-auto p-4 border-r border-r-gray-200 flex flex-col", className)}>
      <div className="hidden md:block border-b dark:border-b-black border-b-zinc-300 pb-4">
        <MenuTitle />
      </div>
      <div className="py-4 grow">
        <MenuItem href="/">Dashboard</MenuItem>
        <MenuItem href="/info-rafaga">Información Ráfaga</MenuItem>
        <MenuItem href="/saldo">Saldo</MenuItem>
        <MenuItem href="/pagos-fijos">Pagos fijos</MenuItem>
        <MenuItem href="/logs-chatbot">Logs de chatbot</MenuItem>
        <MenuItem href="/configuracion">Configuración</MenuItem>
      </div>
      <div className="flex justify-center">
        <form action="/auth/signout" method="post">
          <Button variant="link"type="submit">
            Cerrar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MainMenu;
