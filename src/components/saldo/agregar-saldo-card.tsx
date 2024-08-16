"use client";

import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  amount: z.number().positive("El monto debe ser positivo"),
  notes: z.string().optional(),
  receipt: z.instanceof(File, { message: "El comprobante es obligatorio" })
    .refine(file => file && file.size <= 5000000, `El tamaño máximo del archivo es 5MB`)
    .refine(
      file => file && ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
      "Solo se permiten archivos JPG, PNG o PDF"
    ),
});

type FormData = z.infer<typeof formSchema>;

const AgregarSaldoCard: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const fileExt = data.receipt.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `saldo/${fileName}`;

      // Subir el archivo
      const { error: uploadError } = await supabase.storage
        .from('comprobantes')
        .upload(filePath, data.receipt);

      if (uploadError) throw uploadError;

      // Insertar en la base de datos
      const { data: insertData, error: insertError } = await supabase
        .from("saldo_bot")
        .insert([
          {
            monto: data.amount,
            notas: data.notes,
            file_path: filePath,
          },
        ])
        .select();

      if (insertError) throw insertError;

      toast({
        title: "Éxito",
        description: "El saldo y el comprobante se han agregado correctamente.",
      });
      form.reset();
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar el saldo. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="min-h-[300px] flex flex-col grow">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Agregar Saldo (USD)</CardTitle>
        <p className="text-xs text-muted-foreground">
          Especifica el monto a agregar y sube el comprobante
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receipt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comprobante</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
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
                  Agregando Saldo...
                </>
              ) : (
                'Agregar Saldo'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AgregarSaldoCard;