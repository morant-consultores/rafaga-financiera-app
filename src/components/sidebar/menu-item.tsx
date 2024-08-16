"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useContext } from "react";
import { DrawContext } from "../ui/drawer";

interface Props {
  children: React.ReactNode;
  href: string;
}

const MenuItem: FC<Props> = ({ children, href }): JSX.Element => {
  const { onClose } = useContext(DrawContext);
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      className={cn(
        "block p-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md text-primary hover:text-primary",
        isActive &&
          "bg-gray-200 text-primary hover:bg-gray-200 hover:text-primary"
      )}
      href={href}
      onClick={onClose}
    >
      {children}
    </Link>
  );
};

export default MenuItem;
