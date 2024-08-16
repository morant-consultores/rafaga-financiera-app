import Image from "next/image";
import { FC } from "react";

interface Props {}

const MenuTitle: FC<Props> = (props): JSX.Element => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="flex w-[40px] h-[40px] items-center">
        <Image
          src="/rafaga.svg"
          alt="Ráfaga Financiera Logo"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <h4 className="font-bold text-primary">RÁFAGA FINANCIERA</h4>
    </div>
  );
};

export default MenuTitle;
