"use client";

import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { generateOpenAIEmbeddings } from "@/utils/openai/embeddings";

interface Props {
  children: JSX.Element;
  id?: string;
}

const formSchema = z.object({
  titulo: z.string().min(2, {
    message: "El título debe tener al menos 2 caracteres.",
  }),
  texto: z.string().min(5, {
    message: "El texto debe tener al menos 5 caracteres.",
  }),
});

const TextoRafagaDialog: FC<Props> = ({ children, id }): JSX.Element => {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      texto: "",
    },
  });

  useEffect(() => {
    if (id && open) {
      setIsLoading(true);
      const fetchData = async () => {
        const { data, error } = await supabase
          .from("textos_rafaga")
          .select("titulo, texto")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching data:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información del texto.",
          });
        } else if (data) {
          form.reset(data);
        }
        setIsLoading(false);
      };

      fetchData();
    }
  }, [id, form, toast, open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { titulo, texto } = values;

    const embedding = await generateOpenAIEmbeddings(titulo + " " + texto);

    if (id) {
      // Actualizar registro existente
      const { error } = await supabase
        .from("textos_rafaga")
        .update({ titulo, texto, embedding })
        .eq("id", id);

      if (error) {
        console.error("Error updating data:", error);
        toast({
          title: "Error",
          description: "Hubo un problema al actualizar el texto.",
        });
      } else {
        toast({
          title: "Texto Actualizado",
          description: "El texto ha sido actualizado exitosamente.",
        });
        setOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("textos_rafaga")
        .insert([{ titulo, texto, embedding }]);

      if (error) {
        console.error("Error inserting data:", error);
        toast({
          title: "Error",
          description: "Hubo un problema al guardar el texto.",
        });
      } else {
        toast({
          title: "Texto Guardado",
          description: "El texto ha sido guardado exitosamente.",
        });
        form.reset();
        setOpen(false);
      }
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-[90%] h-[90%] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {id ? "Editar Texto Ráfaga" : "Agregar Texto Ráfaga"}
          </DialogTitle>
          <DialogDescription>
            Textos que utiliza el chatbot para contestar correctamente
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-grow space-y-4"
          >
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título del texto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="texto"
              render={({ field }) => (
                <FormItem className="flex-grow flex flex-col">
                  <FormLabel>Texto</FormLabel>
                  <FormControl className="flex-grow">
                    <Textarea
                      placeholder="Contenido del texto ráfaga"
                      className="resize-none h-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Cargando..." : id ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TextoRafagaDialog;