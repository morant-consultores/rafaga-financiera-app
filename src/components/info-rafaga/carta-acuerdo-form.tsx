"use client";

import { FC, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from '@/utils/supabase/client';

const pdfUploadSchema = z.object({
  pdfFile: z.any()
    .refine((file) => file instanceof File, "Se requiere un archivo")
    .refine((file) => file.type === "application/pdf", "El archivo debe ser un PDF")
});

type PdfUploadFormValues = z.infer<typeof pdfUploadSchema>;

const CartaAcuerdoForm: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<PdfUploadFormValues>({
    resolver: zodResolver(pdfUploadSchema),
  });

  const onSubmit = async (data: PdfUploadFormValues) => {
    setIsSubmitting(true);
    try {
      const file = data.pdfFile;
      console.log(file)
      
      const { error } = await supabase
        .storage
        .from('rafaga')
        .update('carta_acuerdo.pdf', file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "El archivo PDF se ha actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error al actualizar el archivo:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el archivo. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Controller
          name="pdfFile"
          control={form.control}
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Archivo PDF</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            'Actualizar Carta Acuerdo'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CartaAcuerdoForm;