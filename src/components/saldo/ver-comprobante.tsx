"use client";

import { FC, useState } from "react";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";

interface Props {
  file_path: string;
}

const ComprobanteSaldoBtn: FC<Props> = ({ file_path }): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleViewDocument = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.storage
        .from("comprobantes")
        .getPublicUrl(file_path);

      if (data && data.publicUrl) {
        // Agregar el parámetro de tiempo a la URL
        const currentTime = new Date().toISOString();
        const urlWithTime = `${data.publicUrl}${
          data.publicUrl.includes("?") ? "&" : "?"
        }t=${encodeURIComponent(currentTime)}`;

        window.open(urlWithTime, "_blank");
      }
    } catch (error) {
      console.error("Error al obtener la URL del documento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full flex justify-start px-2 font-normal"
      onClick={handleViewDocument}
      disabled={isLoading}
    >
      Ver comprobante
    </Button>
  );
};

export default ComprobanteSaldoBtn;
