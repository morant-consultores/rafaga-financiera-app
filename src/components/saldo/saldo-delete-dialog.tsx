import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function DeleteSaldoDialog({ id, filePath }: { id: string; filePath: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Eliminar el archivo del almacenamiento
      const { error: storageError } = await supabase
        .storage
        .from('comprobantes')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Eliminar el registro de la base de datos
      const { error: dbError } = await supabase
        .from("saldo_bot")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      toast({
        title: "Éxito",
        description: "El registro y el archivo asociado han sido eliminados correctamente.",
      });
    } catch (error) {
      console.error("Error al borrar el registro y/o archivo:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el registro y/o archivo. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex justify-start px-2 font-normal"
        >
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el registro
            seleccionado de la tabla saldo_bot y el archivo asociado del almacenamiento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}