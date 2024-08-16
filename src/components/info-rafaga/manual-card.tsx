'use client';

import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { File } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import ManualForm from "./manual-form";

interface Props {}

const ManualCard: FC<Props> = (props): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleViewDocument = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.storage
        .from("rafaga")
        .getPublicUrl("manual_inscritos.pdf");
    
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
    <Card className="min-h-[300px] flex flex-col grow">
      <CardHeader>
        <div className="flex justify-between space-x-8">
          <div className="space-y-2">
            <CardTitle className="text-sm font-medium">Manual Inscritos</CardTitle>
            <p className="text-xs text-muted-foreground">
              Aquí puedes actualizar el manual para inscritos
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
        <ManualForm />
      </CardContent>
    </Card>
  );
};

export default ManualCard;