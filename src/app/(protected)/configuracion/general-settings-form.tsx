"use client";

import { FC, useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { createClient } from '@/utils/supabase/client';
import { useToast } from "@/components/ui/use-toast";

const configFormSchema = z.object({
  input_token_price_per_million_usd: z.number().min(0, "El precio debe ser un número positivo"),
  output_token_price_per_million_usd: z.number().min(0, "El precio debe ser un número positivo"),
  balance_alert_threshold_usd: z.number().min(0, "El umbral debe ser un número positivo"),
});

type ConfigFormValues = z.infer<typeof configFormSchema>;

const ConfiguracionGeneralForm: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      input_token_price_per_million_usd: 0,
      output_token_price_per_million_usd: 0,
      balance_alert_threshold_usd: 0,
    },
  });

  useEffect(() => {
    const fetchConfigSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('config_settings')
          .select('input_token_price_per_million_usd, output_token_price_per_million_usd, balance_alert_threshold_usd')
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          form.reset(data);
        }
      } catch (error) {
        console.error("Error al cargar la configuración:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfigSettings();
  }, [supabase, form, toast]);

  const onSubmit = async (data: ConfigFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('config_settings')
        .update(data)
        .eq('id', 1);

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "La configuración se ha actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error al actualizar la configuración:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <FormField
          control={form.control}
          name="input_token_price_per_million_usd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio de token de entrada (USD por millón)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Establece el precio por millón de tokens de entrada en USD. <small>(Precio recomendado: 0.25 / 0.7 = 0.0358)</small>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="output_token_price_per_million_usd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio de token de salida (USD por millón)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Establece el precio por millón de tokens de salida en USD. <small>(Precio recomendado: 1.25 / 0.7 = 0.179)</small>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="balance_alert_threshold_usd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Umbral de alerta de balance (USD)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Establece el umbral de balance en USD para recibir alertas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ConfiguracionGeneralForm;