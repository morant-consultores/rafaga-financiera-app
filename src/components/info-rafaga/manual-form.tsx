"use client";

import { FC, useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from '@/utils/supabase/client';
import { PasswordInput } from "@/components/ui/password-input";

const manualUploadSchema = z.object({
  pdfFile: z.any().optional(),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres")
});

type ManualUploadFormValues = z.infer<typeof manualUploadSchema>;

const ManualForm: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<ManualUploadFormValues>({
    resolver: zodResolver(manualUploadSchema),
  });

  useEffect(() => {
    const loadPassword = async () => {
      const { data, error } = await supabase
        .from('manual_inscritos')
        .select('pwd')
        .eq('id', 1)
        .single();

      if (error) {
        console.error("Error al cargar la contraseña:", error);
      } else if (data?.pwd) {
        form.setValue('password', data.pwd);
      }
    };

    loadPassword();
  }, [form]);

  const onSubmit = async (data: ManualUploadFormValues) => {
    setIsSubmitting(true);
    try {
      const file = data.pdfFile;
      const password = data.password;

      // Actualizar la contraseña
      const { error: updateError } = await supabase
        .from('manual_inscritos')
        .update({ pwd: password })
        .eq('id', 1);

      if (updateError) throw updateError;

      // Actualizar el archivo PDF solo si se seleccionó uno
      if (file instanceof File) {
        const { error } = await supabase
          .storage
          .from('rafaga')
          .update('manual_inscritos.pdf', file, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) throw error;
      }

      toast({
        title: "Éxito",
        description: file instanceof File 
          ? "El manual y la contraseña se han actualizado correctamente."
          : "La contraseña se ha actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <Controller
          name="pdfFile"
          control={form.control}
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Archivo PDF del Manual (opcional)</FormLabel>
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Ingresa o actualiza la contraseña"
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
            'Actualizar'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ManualForm;