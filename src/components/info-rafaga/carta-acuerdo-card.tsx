'use client';

import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { File } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import CartaAcuerdoForm from "./carta-acuerdo-form";

interface Props {}

const CartaAcuerdoCard: FC<Props> = (props): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleViewDocument = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.storage
        .from("rafaga")
        .getPublicUrl("carta_acuerdo.pdf");
    
      if (data && data.publicUrl) {
        // Agregar el parámetro de tiempo a la URL
        const currentTime = new Date().toISOString();
        const urlWithTime = `${data.publicUrl}${data.publicUrl.includes('?') ? '&' : '?'}t=${encodeURIComponent(currentTime)}`;
        
        window.open(urlWithTime, "_blank");
      }
    } catch (error) {
      console.error("Error al obtener la URL del documento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="space-y-1 min-h-[300px]">
      <CardHeader>
        <div className="flex justify-between">
          <div className="space-y-2">
            <CardTitle className="text-sm font-medium">Carta Acuerdo</CardTitle>
            <p className="text-xs text-muted-foreground">
              Aquí puedes actualizar la carta acuerdo
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              onClick={handleViewDocument}
              disabled={isLoading}
            >
              <File className="mr-2 h-4 w-4" /> Ver
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        <CartaAcuerdoForm />
      </CardContent>
    </Card>
  );
};

export default CartaAcuerdoCard;