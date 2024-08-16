"use client";

import { useState, useEffect } from "react";
import MainMenu from "@/components/sidebar/main-menu";
import MenuTitle from "@/components/sidebar/menu-title";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MenuIcon } from "lucide-react";

const Menu = (): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Renderiza un placeholder mientras se monta el componente
  if (!mounted) {
    return (
      <div className="overflow-auto p-4 border-r border-r-gray-200 flex flex-col">
        <div className="hidden md:block">
          <MenuTitle />
        </div>
      </div>
    );
  }

  if (isDesktop) {
    return <MainMenu className="flex" />;
  }

  return (
    <div className="p-4 flex justify-between sticky top-0 left-0 border-b border-border bg-white z-50">
      <MenuTitle />
      <Drawer
        direction="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenChange={(open) => setMobileMenuOpen(open)}
      >
        <DrawerTrigger>
          <MenuIcon />
        </DrawerTrigger>
        <DrawerContent>
          <MainMenu />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Menu;
